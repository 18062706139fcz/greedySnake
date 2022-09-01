# greedySnake

### Introduction

+ 这是一个贪吃蛇小游戏。

> It's a TypeScript game.

主要技术栈为 `Webpack`， `TypeScript`, `less`.

### Usage

+ 安装相关依赖

> `npm i`

+ 启动应用

> `npm start`

### Explanation

#### 1. tsconfig.json配置

```json
{
    "compilerOptions": {
        "target": "ES2015",
        "module": "ES2015",
        "strict": true,
        "noEmitOnError": true 
    }
}
```

> 此处是对**编译选项**进行配置
>
> 1. `target`: 我们将`TS`转译成`JS`的版本。
> 2. `module`: 模块化的版本。
> 3. `strict`: 所有相关的严格模式是否开启。
> 4. `noEmitOnError`: 当出现错误时是否停止编译。

#### 2. HTML & CSS 布局相关

+ 先来看看我们整体的布局

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body scroll="no">
    <!-- 创建游戏的主容器 -->
    <div id="main">
        <!-- 设置游戏舞台 -->
        <div id="stage">
            <!-- 设置蛇 -->
            <div id="snack">
                <!-- snack内部的div表示蛇的各部分 -->
                <div></div>
            </div>
            <div id="food">
                <!-- 设置食物的样式 -->
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <!-- 设置游戏的积分牌 -->
        <div id="scoreStage">
            <div>SCORE:<span id="score">0</span></div>
            <div>LEVEL:<span id="level">1</span></div>
        </div>
    </div>
</body>
</html>
```

+ **CSS代码**

```css
// 设置变量
@bgColor: #b7d4a8;

// 清除默认样式清除默认样式
* {
    margin: 0;
    padding: 0;
    // 怪异模式
    box-sizing: border-box;
}

body {
    font: bold 20px "Courier";
    width: 100%;
    height: 100%;
    overflow: hidden;
}

// 设置主窗口的样式
#main {
    width: 360px;
    height: 420px;
    background-color: @bgColor;
    margin: 100px auto;
    border: 10px solid #000;
    border-radius: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // 主轴对齐方式
    justify-content: space-around;
    
}

#stage {
    width: 304px;
    height: 304px;
    border: 2px solid black;
    position: relative;
}

#scoreStage {
    width: 300px;
    display: flex;
    justify-content: space-between;
}

#snack {
    &>div {
        width: 10px;
        height: 10px;
        background-color: #000;
        border: 1px solid @bgColor;
        position: absolute;
    }
}

// 食物
#food {
    width: 10px;
    height: 10px;
    position: absolute;
    left: 40px;
    top: 100px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: space-between;
    &>div {
        width: 4px;
        height: 4px;
        background-color: #000;
        transform: rotate(45deg);
        // border: 1px solid @bgColor;
    }
}

body {
    scroll-behavior: unset;
}
```

> 这里面比较有意思是可以通过`@xxx`来设置CSS变量
>
> 比如这里的：`@bgColor: #b7d4a8;`

![截屏2022-09-01 下午10.13.14](/Users/fengcaizhi/Desktop/截屏2022-09-01 下午10.13.14.png)

#### 3. TS核心逻辑

+ TS的核心在于`Class`，所以我们需要定义出非常多的类来对这个贪吃蛇小游戏进行分析。

+ 我们先来看看这个贪吃蛇小游戏有几个主要的部分。

1. 食物
2. 蛇
3. 分数版
4. 游戏操控

##### 食物

+ 食物有几个核心逻辑

> 食物这个类。
>
> 首先，我们需要获取其中的横纵坐标。可以设置`get`来获取`X`与`Y`。
>
> 其次，当蛇蛇碰到食物的时候，这个食物的位置会改变，可以设置一个`change()`方法。

```ts
class Food {
    // 属性 & 方法
    // 定义食物所对应的元素
    element: HTMLElement;

    constructor() {
        // 加一个 “!”表示这玩意不会为空
        this.element = document.getElementById('food')!;
    }
    // 方法
    // 1. 获取食物的x坐标的方法
    get X() {
        return this.element.offsetLeft;
    }
    // 2. 获取食物的y坐标的方法
    get Y() {
        return this.element.offsetTop;
    }
    
    // 修改食物位置的方法
    change() {
        // 使用random，生成随机位置
        // 蛇移动一次就是一格，大小为10
        const left = Math.round(Math.random()*29)*10;
        const top = Math.round(Math.random()*29)*10;
        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
    }

}

export default Food
```

#### 蛇

+ 蛇的话，话头就很多了。

> 首先，我们需要获取到蛇头的横纵坐标，还要能够给横纵坐标赋值。
>
> 其次，我们需要有方法增加蛇的身子`addBody`
>
> 同时还需要增加身子移动的方式`moveBody`
>
> 当然还需要增加检测机制，舌头不能与身子重叠

+ 这个比较复杂，我们分而析之

1. 元素设置与`constructor`

```ts
// 表示蛇的元素
head: HTMLElement;
// 蛇的身体，包括蛇头
bodies: HTMLCollection;
// 获取蛇的容器
element: HTMLElement;
constructor() {
   // 断言一下 ｜ 找到蛇头
  this.head = document.querySelector('#snack > div') as HTMLElement;
  this.element = document.getElementById('snack')!
  this.bodies = this.element.getElementsByTagName('div');
}
```

> 这里面的`!`是用来确定存在id为`snack`这个元素的。

2. 增加身子

```ts
addBody() {
	this.element.insertAdjacentHTML("beforeend", "<div></div>")
}
```

3. 移动身子

```ts
    moveBody() {
        /**
         * 将后边身体设置为前边身体的位置
         * 第四节 = 第三节的位置
         * 第三节 = 第二节的位置
         * 第二节 = 第一节的位置
        */
        // 调节每个位置
        for(let i=this.bodies.length-1;i>0;i--) {
            // 获取前边身体的位置
            let X = (this.bodies[i-1] as HTMLElement).offsetLeft;
            let Y = (this.bodies[i-1] as HTMLElement).offsetTop;
            // 将这个值设置到当前身体
            (this.bodies[i] as HTMLElement).style.left = X + 'px';
            (this.bodies[i] as HTMLElement).style.top = Y + 'px';
        }
    }
```

4. 检测机制

```ts
    checkHeadBody() {
        // 获取所有的身体，检查其是否和蛇头的坐标发生重叠
        for(let i=1;i<this.bodies.length;i++) {
            const bd = (this.bodies[i] as HTMLElement)
            if(this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
                // 说明出现了碰撞
                throw Error('撞到自己了～～～')
            }
        }
    }
```

5. 完整代码

```ts
class Snack {
    // 表示蛇的元素
    head: HTMLElement;
    // 蛇的身体，包括蛇头
    bodies: HTMLCollection;
    // 获取蛇的容器
    element: HTMLElement;
    constructor() {
        // 断言一下 ｜ 找到蛇头
        this.head = document.querySelector('#snack > div') as HTMLElement;
        this.element = document.getElementById('snack')!
        this.bodies = this.element.getElementsByTagName('div');
    }

    // 获取蛇的坐标
    get X() {
        return this.head.offsetLeft
    }
    get Y() {
        return this.head.offsetTop
    }

    // 设置蛇的坐标
    set X(value) {
        // 新值和旧值相同，直接返回，无需修改。
        if(this.X === value) return
        if(value < 0 || value > 290) {
            throw new Error('您撞墙了')
        }
        // 蛇在往左走，不能往右走
        if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value) {
            // 让蛇向反方向继续移动
            if(value > this.X) {
                // 如果新值大于旧值X，说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
                value = this.X - 10
            } else {
                value = this.X + 10
            }
        }

        this.moveBody()
        this.head.style.left = value + 'px'
        this.checkHeadBody()
    }
    set Y(value) {
        if(this.Y === value) return
        if(value < 0 || value > 290) {
            throw new Error('您撞墙了')
        }
        if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value) {
            // 让蛇向反方向继续移动
            if(value > this.Y) {
                // 如果新值大于旧值X，说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
                value = this.Y - 10
            } else {
                // 不是 += 是等于
                value = this.Y + 10
            }
        }
        this.moveBody()
        this.head.style.top = value + 'px'
        this.checkHeadBody()
    }

    // 蛇增加一截
    addBody() {
        this.element.insertAdjacentHTML("beforeend", "<div></div>")
    }
    //  添加一个蛇身体移动的方法
    moveBody() {
        /**
         * 将后边身体设置为前边身体的位置
         * 第四节 = 第三节的位置
         * 第三节 = 第二节的位置
         * 第二节 = 第一节的位置
        */
        // 调节每个位置
        for(let i=this.bodies.length-1;i>0;i--) {
            // 获取前边身体的位置
            let X = (this.bodies[i-1] as HTMLElement).offsetLeft;
            let Y = (this.bodies[i-1] as HTMLElement).offsetTop;
            // 将这个值设置到当前身体
            (this.bodies[i] as HTMLElement).style.left = X + 'px';
            (this.bodies[i] as HTMLElement).style.top = Y + 'px';
        }
    }

    checkHeadBody() {
        // 获取所有的身体，检查其是否和蛇头的坐标发生重叠
        for(let i=1;i<this.bodies.length;i++) {
            const bd = (this.bodies[i] as HTMLElement)
            if(this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
                // 说明出现了碰撞
                throw Error('撞到自己了～～～')
            }
        }
    }
}

export default Snack
```

##### 得分面板

+ 这个就比较简单了，主要是得分增加的方法与等级提升的方法。

```ts
class scorePanel {
    // score和level用来记录分数和等级
    score: number = 0;
    level: number = 1;
    scoreSpan: HTMLElement;
    levelSpan: HTMLElement;

    // 设置等级
    maxLevel: number;
    // 设置一个变量表示多少分升级
    upScore: number;
    // 给两个需要修改的元素赋值
    constructor(maxLevel: number = 10, upScore: number = 2) {
        this.scoreSpan = document.getElementById('score')!;
        this.levelSpan = document.getElementById('level')!;

        this.maxLevel = maxLevel
        this.upScore = upScore
    }

    // method
    // 设置加分的方法
    addScore() {
        // 分数自增
        this.score += 1
        this.scoreSpan.innerHTML = this.score + '';
        // 判断一下分数是多少
        if(this.score % this.upScore === 0) {
            this.levelUp()
        }
    }


    // 提升等级的方法
    levelUp() {
        if(this.level < this.maxLevel) {
            this.level += 1
            this.levelSpan.innerHTML = this.level + '';
        }
    }
}

export default scorePanel
```

##### 控制面板

+ 这个逻辑的核心之一是整合，之二是监控键盘`keydown`事件
+ 关于整合：我们会把其中的蛇，面板，食物都整合到这个类中，所谓一个启动游戏的开关。

```ts
    snack: Snack;
    food: Food;
    scorePanel: scorePanel;
    arrowDirection: string = '';
    // 创建一个属性用来记录游戏是否结束
    isLeave: boolean = true
    constructor() {
        this.snack = new Snack();
        this.food = new Food();
        this.scorePanel = new scorePanel();
        this.init();
    }
```

+ 关于监控键盘事件

> 这里的核心逻辑就是监控，看是上下左右中的哪一个，然后对应的改变蛇蛇的方向。
>
> 其中蛇的移动需要不断的调用`run`这个函数，所以我们使用`isLeave`作为开关，用递归来多次调用`run`这个函数。

```ts
import Snack from './snack';
import Food from "./Food";
import scorePanel from './scorePanel';

class GameControl {
    snack: Snack;
    food: Food;
    scorePanel: scorePanel;
    arrowDirection: string = '';
    // 创建一个属性用来记录游戏是否结束
    isLeave: boolean = true
    constructor() {
        this.snack = new Snack();
        this.food = new Food();
        this.scorePanel = new scorePanel();
        this.init();
    }
    // 游戏的初始化方法
    init() {
        // 绑定键盘按下的时间
        // const _this = this
        // 如果不改变这个this，则会绑定到document上面
        // document.addEventListener('keydown', _this.keyDownHandler)
        document.addEventListener('keydown', this.keyDownHandler.bind(this));
        // 调用run方法
        this.run();
    }
    // 创建一个键盘按下的响应函数
    /**
     *  ArrowRight Right
        ArrowLeft Left
        ArrowDown Down
        ArrowUp Up
    */
    keyDownHandler(event: KeyboardEvent) {
        this.arrowDirection = event.key
        // this.run();
    }

    // 创建一个控制蛇移动的方法
    run() {
        // 根据方向(this.direction)来使蛇的位置改变
        // 向上 top -
        // 向下 top +
        // 向左 left - 
        // 向右 left +
        let X = this.snack.X;
        let Y = this.snack.Y;
        // 根据按键方向修改值
        switch (this.arrowDirection) {
            case "ArrowUp":
            case "Up":
                // 向上移动 
                Y -= 10
                break;
            case "ArrowDown":
            case "Down":
                Y += 10
                break;
            case "ArrowLeft":
            case "Left":
                X -= 10
                break
            case "ArrowRight":
            case "Right":
                X += 10
                break
        }
        try {
            this.snack.X = X;
            this.snack.Y = Y;
        } catch(e: any) {
            alert(e.message)
            this.isLeave = false
        }
        
        this.checkEat(X, Y)
        // 开启定时调用
        // 这是递归调用
        this.isLeave && setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30);
    }

    // 定义一个方法，用来检查蛇是否吃到食物
    checkEat(x:number, y:number) {
        if(x === this.food.X && y === this.food.Y) {
            this.food.change() // 食物改变位置
            this.scorePanel.addScore() // 分数增加
            this.snack.addBody()
        }
    }
}

export default GameControl
```

### 项目源码链接

[Github](https://github.com/18062706139fcz/greedySnake/tree/main)
