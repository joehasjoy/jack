// 复制到剪切板
export function copyHandle(content, that) {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  that.$message({
    message: '复制成功',
    type: 'success'
  })
}
export function previewURL(url){
  var basePreviewUrl=window._env_.previewURL

}