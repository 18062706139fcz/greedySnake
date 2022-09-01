/*
 * @Author: 18062706139 2279549769@qq.com
 * @Date: 2022-09-01 16:44:24
 * @LastEditors: 18062706139 2279549769@qq.com
 * @LastEditTime: 2022-09-01 16:44:49
 * @FilePath: /snacks/src/modules/Food.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
// 测试代码
// const food = new Food();
// console.log(food.X, food.Y)
// food.change()
// console.log(food.X, food.Y)