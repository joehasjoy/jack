<template>
    <el-container style="margin: 10px 10px 10px 10px">

      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="产品类型">
          <el-select v-model="form.ProductCode" placeholder="产品类型">
            <el-option label="ecs" value="ecs"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="form.OrderType" placeholder="订单类型">
            <el-option label="续费 Renewal" value="Renewal"></el-option>
            <el-option label="新购 NewOrder" value="NewOrder"></el-option>
            <el-option label="升级 Upgrade" value="Upgrade"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期单位">
          <el-select v-model="form.ServicePeriodUnit" placeholder="ServicePeriodUnit">
            <el-option label="Month" value="Month"></el-option>
            <el-option label="Year" value="Year"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期">
          <el-input v-model="form.ServicePeriodQuantity" type="number" value="1"></el-input>
        </el-form-item>
        <el-form-item label="实例类型" prop="instance_type" :rules="[{required:true,message:'请选择实例类型.', trigger: 'blur'}]">
          <el-select v-model="form.instance_type" filterable placeholder="os_type">
            <el-option :label="item.InstanceTypeId+'--'+item.CpuCoreCount+'c/'+item.MemorySize+'GB'" :value="item.InstanceTypeId" v-for="(item, index) in instance_type_data" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统类型">
          <el-select v-model="form.os_type" placeholder="os_type">
            <el-option label="linux" value="linux"></el-option>
            <el-option label="windows" value="windows"></el-option>
            <el-option label="ubuntu" value="ubuntu"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统盘类型">
          <el-select v-model="form.sys_disk_type" placeholder="sys_disk_type">
            <el-option :label="item.key" :value="item.value" v-for="(item, index) in disk_type" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统盘大小GB">
          <el-input v-model="form.sys_disk_size" type="number" value="100"></el-input>
        </el-form-item>
        <el-form-item :label="'Data数据盘'+i" v-for="(d,i) in form.data_disk" :key="i">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
              <el-select v-model="d.type" placeholder="数据盘类型">
                <el-option :label="item.key" :value="item.value" v-for="(item, index) in disk_type" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="d.size" placeholder="数据盘大小GB"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="removeDataDiks(d)">删除</el-button>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="addDataDiks">新增数据盘</el-button>
<!--          <el-button>取消</el-button>-->
        </el-form-item>
      </el-form>
      <pre>{{jsonData}}</pre>
<!--      <json-viewer :value="jsonData"></json-viewer>-->
    </el-container>
</template>

<script>
  export default {
    name: 'enquiry',
    data() {
    return {
      jsonData: {},
      disk_type: [
        {'key':'cloud_efficiency', 'value':'cloud_efficiency'},
        {'key':'cloud_ssd', 'value':'cloud_ssd'},
        {'key':'cloud_essd', 'value':'cloud_essd'},
        {'key':'ephemeral_ssd', 'value':'ephemeral_ssd'},
        ],
      instance_type_data: [],
      form: {
        ProductCode: 'ecs',
        OrderType: 'Renewal',
        ServicePeriodUnit: 'Month',
        ServicePeriodQuantity: 1,
        instance_type: '',
        os_type: 'linux',
        sys_disk_type: 'cloud_efficiency',
        sys_disk_size: 100,
        data_disk: [],
      },
      url_price: this.GLOBAL.service_tag+'/api/aliyun/price/',
      url_instacetype: this.GLOBAL.service_tag+'/api/aliyun/InstanceType/'
    }
  },
    mounted () {
      this.GetInitInstance()
    },
    methods: {
      onSubmit() {
        // console.log('submit!', this.form);
        if(!this.form.instance_type){this.$notify.warning('请输入必填项.'); return}
        // if(!this.form.data_disk){delete this.form['data_disk']}
        // this.form.data_disk = JSON.stringify(this.form.data_disk)
        const params = JSON.parse(JSON.stringify(this.form))
        params.data_disk = JSON.stringify(params.data_disk)
        this.axios({
          method: 'GET',
          url: this.url_price,
          params: params,
        }).then((response)=>{
          // console.log(response.data.data);
          if(response.data.status){
            // console.log(response.data.data);
            this.jsonData = response.data.data
            this.$notify.success({message: response.data.data.Message})
          }else {this.$notify.error({message: 'GetInitInstance Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'GetInitInstance Error: '+ response});
        });
      },
      GetInitInstance(){
        this.axios({
          method: 'GET',
          url: this.url_instacetype,
          // data: this.qs.stringify({'row': JSON.stringify(row)}),
        }).then((response)=>{
          // console.log(response.data.data);
          // console.log(response.data.data.instance.InstanceTypes.InstanceType);
          if(response.data.status){
            this.instance_type_data = response.data.data.instance.InstanceTypes.InstanceType
          }else {this.$notify.error({message: 'GetInitInstance Error: '+ response.data.error})}
        }).catch((response) => {
          this.$notify.error({message: 'GetInitInstance Error: '+ response});
        });
      },
      removeDataDiks(item) {
        var index = this.form.data_disk.indexOf(item)
        if (index !== -1) {
          this.form.data_disk.splice(index, 1)
        }
      },
      addDataDiks () {
        this.form.data_disk.push({
          'type': 'cloud_efficiency',
          'size': 100
        });
      },
  }
  }
</script>

<style scoped>

</style>
