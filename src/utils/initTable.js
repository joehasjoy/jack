function GetTableData(url,page_size, page_index,tableData,total, conn) {
  // console.log("url:", this.baseURI)
  console.log("GetTableData:", page_size, page_index)
  this.NProgress.start()
  if(conn==undefined){conn=''}
  const parms = {"pageSize": page_size, "pageNumber": page_index}
  this.axios({
    method: 'GET',
    url: url,
    params: parms,
  }).then((response)=>{
    console.log(response);
    if(response.data.status){
      tableData = response.data.rows
      total = response.data.total
    }else {this.$notify.error({message: response.data.error})}
  }).catch((response) => {
    this.$notify.error({message: 'GetTableData Error: '+ response});
  });
  this.NProgress.done();
}

export default {
  GetTableData,
}
