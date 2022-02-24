const toolboxWidth = document.querySelector('section.toolbox').offsetWidth;
let canvas = null;
let bgColor = '#B51C1C'
let selectedTool = 'ink'
let paintColor = '#000000'
let ifRainbowColor = false
let opacity = 220
let brushSize = 1


function setup() {
    setupToolBox()
    angleMode(DEGREES)

    //设置画布高宽
    canvas = createCanvas(windowWidth - toolboxWidth, windowHeight)
        //把画布通过select放到section。canvas下
    canvas.parent(select('section.canvas'))
    background(bgColor)
    goldenspot()

    distance = 10;
    spring = 0.5;
    friction = 0.5;
    size = 20;
    diff = size / size;
    x = y = ax = ay = a = r = f = 0;

}

function goldenspot(){
    background(bgColor)
    for(i = 0;i<400;i++){
        fill(255,212,131,random(70,255))
        noStroke()
        ellipse(random(0, windowWidth- toolboxWidth), random(0, windowHeight), random(1,8))
    }
}

//画笔设置机
function setupBrushSelector(parentTag) {
    //创建画笔选择器(下拉菜单 createSelect from p5)
    brushSelector = createSelect()
        //选择paintstyle的位置
        // const paintStyles = select(parentTag)
        //放置到父级标签下(paint style)
        // brushSelector.parent(parentTag)
    makeLabel(brushSelector, parentTag, 'Paintbrush style')
        //创建笔刷目录
    const brushes = [
            'ink',    
            'pen',
            'marker',
            'beads',
            'wiggle',
            'toothpick',
            'fountainPen',
            'splatter',
            'sprayPaint',
            
        ]
        //通过option方法，把笔刷目录放到下拉选择器里
    brushes.forEach(function(brush) {
        brushSelector.option(brush)
    })

    //让画笔的值与当前的初始值相同
    selectedTool = brushSelector.value()
        //每当当selector的值改变的时候，把当前画笔换成选择器选中的画笔
    brushSelector.changed(function() {
        selectedTool = brushSelector.value()
    })
}

//打tag机
function makeLabel(tag, parentTag, text) {
    //通过createelemt创建元素‘label’ p5
    const label = createElement('label', text)
        //将label定位到parenttag
    label.parent(parentTag)
        //打上tag
    tag.parent(label)
}

//btn制造机
function setupButton(text, parentTag, onClick) {
    //创建createbutton p5
    const button = createButton(text)
        //把btn放到parenttag下
    button.parent(parentTag)
        //当鼠标按下时运行onclick里的函数
    button.mousePressed(onClick)
    return button
}

//保存图像
function saveFile() {
    saveCanvas('painting', 'png')
}

function setupSaveButton(parentTag) {
    setupButton('Save', parentTag, saveFile)
}

//清除画布
function resetCanvas() {
    resizeCanvas(windowWidth - toolboxWidth, windowHeight)
    background(bgColor)
    goldenspot()
}

function setupResetButton(parentTag) {
    setupButton('Rest', parentTag, resetCanvas)
}

//设置取色器
function setupColorPicker(initialColor, parentTag, text, onClick) {
    // 创建一个取色器 createcolorpicker p5
    const colorPicker = createColorPicker(initialColor)
        // 创建h5标签
    makeLabel(colorPicker, parentTag, text)
        //取色器的值变化的时候执行onclick
    colorPicker.changed(onClick)
        //返回colorpicker
    return colorPicker
}

//设置背景取色器
function setupBgColorPicker(parentTag) {
    //bgcolor是最开始设置的默认颜色，parenttag是父级的位置，
    const bgColorPicker = setupColorPicker(bgColor, parentTag, 'Background color', function() {
        //将背景颜色设置为当前选中的颜色.color返回给p5对象当前选择的颜色
        bgColor = bgColorPicker.color()
        resetCanvas()
    })
}

//设置笔画颜色
function setupPaintColorPicker(parentTag) {
    const paintColorPicker = setupColorPicker(paintColor, parentTag, 'Paint color', function() {
        paintColor = paintColorPicker.color()
        ifRainbowColor = false
    })
    paintColor = paintColorPicker.color()
}
//把画笔颜色赋予fill和color
function setPaintColor() {
    if (ifRainbowColor) {
        //设置hue为framecount的关系
        const hue = Math.floor(sin(frameCount * 10) * 5 + 40)
        console.log(hue)


        //将hue赋予一个颜色变量，赋值给newcolor
        newColor = color(`hsba(${hue}, ${hue}%, 100%, 0.6)`)

    } else {
        newColor = paintColor
    }

    //将newcolor赋值给fill和stroke
    newColor.setAlpha(opacity)
    stroke(newColor)
    fill(newColor)

}

//切换彩虹按钮
function setupRainbowColorButton(parentTag) {
    setupButton('💰Golden', parentTag, function() {
        ifRainbowColor = !ifRainbowColor
    })
}

//slicer铸造器
function setupSlider(min, max, initialValue, step, text, parentTag, onInput) {
    const slider = createSlider(min, max, initialValue, step)
        //通过tag铸造器加到html中
    makeLabel(slider, parentTag, text)
        //值变换时调用onInput
    slider.input(onInput)
    return slider
}

function setupOpacitySlider(parentTag) {
    //调用slider铸造其
    const opacitySlider = setupSlider(0, 255, opacity, 1, 'Opacity', parentTag, function() {
        //讲值赋予opacity
        opacity = opacitySlider.value()
    })
}

//笔画大小滑块
function setupBrushSizeSlider(parentTag) {
    const brushSizeSlizer = setupSlider(1, 16, brushSize, 0.1, 'Brush size', parentTag, function() {
        brushSize = brushSizeSlizer.value()
    })
}

//快捷键
function keyPressed() {
    if (keyCode === BACKSPACE) {
        resetCanvas()
    } else if (key === 's') {
        saveFile()
    } else if (key === 'g') {
        ifRainbowColor = !ifRainbowColor
    }
}








function setupToolBox() {
    //设置 选择style-tools标签
    const paintStyles = select('section.toolbox div.styles-tools')
        //放置设置笔刷模块，传入上上方style tools的标签的参数
    setupBrushSelector(paintStyles)
    setupPaintColorPicker(paintStyles)
    setupRainbowColorButton(paintStyles)
    setupOpacitySlider(paintStyles)
    setupBrushSizeSlider(paintStyles)

    //canvas tool quyu
    const canvasTools = select('section.toolbox div.canvas-tools')
    setupSaveButton(canvasTools)
    setupResetButton(canvasTools)

    //background颜色区域, select里填选择位置
    const backgroundStyle = select('section.toolbox div.background-tools')
        //调用设置背景颜色方法
    setupBgColorPicker(backgroundStyle)


}

function draw() {
    //检查鼠标是否按下&在画布范围内
    if (mouseIsPressed && mouseX <= windowWidth - toolboxWidth) {
        //设置画笔颜色
        setPaintColor()
            // 画下
        window[selectedTool]()
    } else if (f) {
        ax = ay = f = 0;
    }
}
