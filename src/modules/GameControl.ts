/*
 * @Author: 18062706139 2279549769@qq.com
 * @Date: 2022-09-01 17:10:37
 * @LastEditors: 18062706139 2279549769@qq.com
 * @LastEditTime: 2022-09-01 19:59:35
 * @FilePath: /snacks/src/modules/GameControl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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