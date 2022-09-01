/*
 * @Author: 18062706139 2279549769@qq.com
 * @Date: 2022-09-01 16:44:32
 * @LastEditors: 18062706139 2279549769@qq.com
 * @LastEditTime: 2022-09-01 20:50:55
 * @FilePath: /snacks/src/modules/scorePanel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 一个对象一个功能
// 定义类


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