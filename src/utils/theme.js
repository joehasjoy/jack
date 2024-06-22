// import '@/style/sidebar.scss'
const VERSION = require('element-ui/package.json').version // element-ui version from node_modules
const STYLE_ID = 'chalk-style'
const ORIGINAL_THEME = '#409EFF' // default color
const ORIGINAL_CLUSTER = getThemeCluster(ORIGINAL_THEME.replace('#', ''))
let originalStyle = null

export const theme = {
  header: '',
  primary: '',
  commonText: 'rgba(255,255,255,0.5)',
  activeText: '#FFFFFF',
  bgColor: '#282936',
  activeColor: 'rgba(255,255,255,0.07)',
  hoverColor: '#20212B'
}

export async function handleColor(theme = {}) {
  try {
    
    let { activeColor, hoverColor, primary } = theme
    setColor('--side-active', activeColor || '')
    setColor('--side-hover', hoverColor || '')

    if (!primary || primary === ORIGINAL_THEME || typeof primary !== 'string') {
      return
    }
    const themeCluster = getThemeCluster(primary.replace('#', ''))
    if (!originalStyle) {
      originalStyle = await getCSSString()
    }
    if (!originalStyle) {
      return
    }
    const chalkHandler = getHandler(originalStyle, themeCluster)
    chalkHandler()
    filterStyle(primary, ORIGINAL_CLUSTER, themeCluster)
  } catch (error) {
    console.log('error')
  }
}
//过滤当前整个页面的样式文件，找到含有oldVal颜色的样式文件
function filterStyle(oldVal, originalCluster, themeCluster) {
  const styles = [].slice
    .call(document.querySelectorAll('style'))
    .filter((style) => {
      const text = style.innerText
      return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
    })
  // 然后，将其中oldVal的颜色，全部换成我们颜色选择器中选择的新的颜色
  styles.forEach((style) => {
    const { innerText } = style
    if (typeof innerText !== 'string') return
    style.innerText = updateStyle(innerText, originalCluster, themeCluster)
  })
}
const getHandler = (originalStyle, themeCluster) => {
  return () => {
    const newStyle = updateStyle(originalStyle, ORIGINAL_CLUSTER, themeCluster)
    let styleTag = document.getElementById(STYLE_ID)
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.setAttribute('id', STYLE_ID)
      document.head.appendChild(styleTag)
    }
    styleTag.innerText = newStyle
  }
}
/* 更新样式 - 使用新的颜色变量替换之前的 */
function updateStyle(style, oldCluster, newCluster) {
  let newStyle = style
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
  })
  return newStyle
}
/**
 * 传入一个颜色的HEX，得到这个颜色的深浅颜色数组
 * 我们知道，我们默认的主色调蓝色，在实际使用中，还需要对应的浅蓝和深蓝
 * @param  {[string]]} theme [color]
 * @return {[array]}       [对应的深浅颜色数组]
 */
function tintColor (color, tint) {
  let red = parseInt(color.slice(0, 2), 16)
  let green = parseInt(color.slice(2, 4), 16)
  let blue = parseInt(color.slice(4, 6), 16)

  if (tint === 0) {
    // when primary color is in its rgb space
    return [red, green, blue].join(',')
  } else {
    red += Math.round(tint * (255 - red))
    green += Math.round(tint * (255 - green))
    blue += Math.round(tint * (255 - blue))

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }
}
function shadeColor (color, shade) {
  let red = parseInt(color.slice(0, 2), 16)
  let green = parseInt(color.slice(2, 4), 16)
  let blue = parseInt(color.slice(4, 6), 16)

  red = Math.round((1 - shade) * red)
  green = Math.round((1 - shade) * green)
  blue = Math.round((1 - shade) * blue)

  red = `0${red.toString(16)}`.slice(-2)
  green = `0${green.toString(16)}`.toString(16).slice(-2)
  blue = `0${blue.toString(16)}`.toString(16).slice(-2)

  return `#${red}${green}${blue}`
}

export function getThemeCluster(theme) {
  const clusters = [theme]
  for (let i = 1; i <= 9; i++) {
    let value = tintColor(theme, Number((i / 10).toFixed(2)))
    clusters.push(value)
  }
  clusters.push(shadeColor(theme, 0.1))
  return clusters
}

export function getCSSString() {
  const url = `https://unpkg.com/element-ui@${VERSION}/lib/theme-chalk/index.css`
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          let data = xhr.responseText.replace(/@font-face{[^}]+}/, '')
          resolve(data)
        } else {
          reject();
        }
      }
    }
    xhr.open('GET', url)
    xhr.send()
  })
}

export function setColor(name, color) {
  document.body.style.setProperty(name, color)
}

/**
 * [addClass description]
 * @param {[type]} ele [description]
 * @param {[type]} cls [description]
 */
export function addClass(ele, cls) {

}