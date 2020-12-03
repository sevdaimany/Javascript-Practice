const moveX = (element, amount , delay) => {
    return new Promise((resolved , reject) => {
        setTimeout(() => {
            const bodyBoundry = document.body.clientWidth;
            const elRight = element.getBoundingClientRect().right;
            const currLeft = element.getBoundingClientRect().left;
            if(elRight + amount > bodyBoundry){
                reject({bodyBoundry , elRight , amount});
            }
            else {
                element.style.transform = `translateX(${currLeft + amount}px)`;
                resolved();
            }
        }, delay);
    })
};


const btn = document.querySelector('button');
async function animateRight(el , amt){
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
    await moveX(el , amt, 1000);
}

animateRight(btn , 100).catch((err) => {
    console.log('Hit the right edge! Now Moving left!');
    animateRight(btn, -100);
})