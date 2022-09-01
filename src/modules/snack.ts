/*
 * @Author: 18062706139 2279549769@qq.com
 * @Date: 2022-09-01 16:47:20
 * @LastEditors: 18062706139 2279549769@qq.com
 * @LastEditTime: 2022-09-01 20:49:43
 * @FilePath: /snacks/src/modules/snack.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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