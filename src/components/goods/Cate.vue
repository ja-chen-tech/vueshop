<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格-->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cate_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delet" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"
    @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            expand-trigger="hover"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //商品分类数据列表
      catelist: [],
      //总数据条数
      total: 0,
      //为table指定数组
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      //控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {},
      cat_name: '',
      //父级分类id
      cat_pid: 0,
      //分类等级默认要添加的是一级分类
      cat_lever: 0,
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器对象
      cascaderProps:{
          value:'cat_pid',
          label:'cat_name',
          children:'children'
      },
      //选中父级分类的数组
      selectedKeys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    //监听pagesie改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    //点击按钮，展示添加分类对话框
    showAddCatDialog() {
      //先获取父级列表
      this.getParentCateList()
      //再展示对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    //选择项发生变化触发函数
    parentCateChange(){
        console.log(this.selectedKeys)
        if(this.selectedKeys.length>0){
          //父级分类id
        this.addCatForm.cat_pid=  this.selectedKeys[this.selectedKeys.length-1]
        //为当前分类的等级赋值
        this.addCatForm.cat_lever=this.selectedKeys.length
        return
        }else{
          this.addCatForm.cat_pid=  0
        //为当前分类的登机赋值
        this.addCatForm.cat_lever=0
        }
    },
    //点击按钮添加新的分类
    addCate(){
  this.$refs.addCateFormRef.validate(async valid=>{
    if(!valid) return
  const{data:res} =await this.$http.post('categories',this.addCateForm)
  if(res.meta.status!==201){
     return this.$message.error('添加分类失败！！！')
  }
  this.$message.success('添加分类成功！！！')
  this.getCateList()
  this.addCateDialogVisible=false
  })
    },
     //监听对话框关闭事件
    addCateDialogClosed(){
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys=[]
        this.addCateForm.cat_lever=0
        this.addCateForm.cat_pid=0
      }
  },
}
</script>

<style lang="less">
.treeTable {
  margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>