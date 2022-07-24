const floorNo = document.getElementById('floor-no');
const liftsNo = document.getElementById('lift-no');
const generate = document.getElementById('submit');
const liftContainer = document.getElementById('lift-container');
const liftInfo = {};

let floor;
let lift;

floorNo.addEventListener('change', (event) => {
    floor = event.target.value;
});

liftsNo.addEventListener('change', (event) => {
    lift = event.target.value;
});

function buttonUp(id) {
    const btnUp = document.createElement('div');
    btnUp.classList.add('btn', 'btn-up');
    btnUp.setAttribute('id',`btn-${id}`)
    btnUp.innerText = 'Up';
    btnUp.addEventListener('click',()=>{
        callLift(id)
    });
    return btnUp;
}

function buttonDown(id) {
    const btnDown = document.createElement('div');
    btnDown.classList.add('btn', 'btn-down');
    btnDown.setAttribute('id',`btn-${id}`)
    btnDown.innerText = 'Down';
    btnDown.addEventListener('click',()=>{
        callLift(id)
    });
    return btnDown;
}
function manageLift({minDisLift, liftNo, calledAt, pos}) {
    const liftt = document.getElementById(`lift-${liftNo}`);
    document.getElementById(`lift-${liftNo}`).style.transition = `bottom ${minDisLift*2}s`;
    document.getElementById(`lift-${liftNo}`).childNodes[0].style.animationName = 'open-close-left-gate';
    document.getElementById(`lift-${liftNo}`).childNodes[0].style.animationDuration = `5s`;
    document.getElementById(`lift-${liftNo}`).childNodes[0].style.animationDelay = `${minDisLift*2}s`;
    document.getElementById(`lift-${liftNo}`).childNodes[0].style.animationTimingFunction = 'linear';
    document.getElementById(`lift-${liftNo}`).childNodes[1].style.animationName = 'open-close-right-gate';
    document.getElementById(`lift-${liftNo}`).childNodes[1].style.animationDuration = `5s`;
    document.getElementById(`lift-${liftNo}`).childNodes[1].style.animationDelay = `${minDisLift*2}s`;
    document.getElementById(`lift-${liftNo}`).childNodes[1].style.animationTimingFunction = 'linear';
    if (pos == 1) {
        liftt.style.bottom = `${+liftt.style.bottom.slice(0, -2) +  (minDisLift)*28}vh`
    } else {
        liftt.style.bottom = `${+liftt.style.bottom.slice(0, -2) -  (minDisLift)*28}vh`;
    }
    liftInfo[liftNo].moving = 1;
    setTimeout(()=> {
        document.getElementById(`lift-${liftNo}`).childNodes[0].style.animation = 'none'
        document.getElementById(`lift-${liftNo}`).childNodes[1].style.animation = 'none'
        liftInfo[liftNo].moving = 0;
    }, ((minDisLift*2)+5)*1000)
    liftInfo[liftNo].floorNo = calledAt;
}
function callLift(calledAt) {
    let minDisLift = Infinity;
    let liftNo;
    let pos;
    for (let i=1; i<=lift; i++) {
        let liftAtFloor = liftInfo[i].floorNo;
        let distance = Math.abs(calledAt - liftAtFloor);
        if (minDisLift>distance && !liftInfo[i].moving) {
            minDisLift = distance;
            pos = calledAt >= liftAtFloor ? 1 : 0;
            liftNo = i;
        }
    }
    liftInfo[liftNo].floorNo = calledAt;
    return manageLift({minDisLift, liftNo, calledAt, pos});
}

function button(buttons, i) {
    const btn = document.createElement('div');
    btn.className = 'button';
    btn.setAttribute('id',`btn-${i}`)
    buttons.forEach(button=>{btn.append(button)});
    return btn;

}
function floorUpArea(elem) {
    const upArea = document.createElement('div');
    upArea.className = 'floor-up-area';
    elem.forEach((ele)=>upArea.append(ele));
    return upArea;
}
function floorDownArea(elem) {
    const downArea = document.createElement('div');
    downArea.className = 'floor-down-area';
    elem.forEach((ele)=>downArea.append(ele));
    return downArea;
}

function floorName(name) {
    const floorname = document.createElement('div');
    floorname.className = 'floor-name';
    floorname.innerText = name;
    return floorname;
}
function floorLine(lift) {
    const floorline = document.createElement('div');
    floorline.className = 'floor-line';
    if (lift) {
        floorline.append(lift)
    }
    return floorline;
}
function lifts(lift, i) {
    const liftBoth = document.createElement('div');
    liftBoth.className = 'lift';
    lift.forEach((liftt) => {
        liftBoth.append(liftt);
    });
    liftBoth.setAttribute('id', `lift-${i}`);
    return liftBoth;
}
function liftRight() {
    const liftt = document.createElement('div');
    liftt.className = 'right';
    return liftt;
}
function liftLeft() {
    const liftt = document.createElement('div');
    liftt.className = 'left';
    return liftt;
}

function floorContainer(elem, index=1) {
    const floorcontainer = document.createElement('div');
    floorcontainer.className = 'floor-container';
    elem.forEach((ele, index)=>{
        floorcontainer.append(ele);
    });
    floorcontainer.setAttribute('id', `floor${index}`);
    return floorcontainer;
}

function createFloors(floor) {
    for (let i=1; i<=floor; i++) {
        if (i==1 || i==floor) {
            const floorUp2 =   floorUpArea([button([buttonDown(i)], i)]);
            const floorDown2 =  floorDownArea([floorLine(),floorName(`Floor ${floor}`)]);
            const floor2 = floorContainer([floorUp2, floorDown2], i);
            liftContainer.prepend(floor2);
        } else  {
            const floorUp =   floorUpArea([button([buttonUp(i), buttonDown(i)], i)]);
            const floorDown =  floorDownArea([floorLine(),floorName(`Floor ${i}`)]);
            const floor = floorContainer([floorUp, floorDown], i);
            liftContainer.prepend(floor);
        }
    }
}
function createLifts(lift) {
    const liftEle = document.createElement('div');
    liftEle.className='lifts';
  for (let i=1; i<=lift; i++) {
    let liftContain = lifts([liftLeft(), liftRight()],i);
       liftContain.style.bottom = '16vh'
     liftEle.append(liftContain);
    liftInfo[i] = {
        floorNo: 1,
        moving: 0
    }
  } 
  liftContainer.childNodes[liftContainer.childNodes.length-1].childNodes[1].childNodes[0].append(liftEle);
}
generate.addEventListener('click', (e)=>{
    e.preventDefault();
    liftContainer.innerHTML ="";
    var floor1;
    if (floor<2) {
        alert("you don't need lift for less than 2 floors");
    } else if (window.innerWidth<490 && lift>1) { 
        alert("only 1 lift allowed for this window size");
    } else if (window.innerWidth<1000 && lift>2) {
        alert("At max 2 lift allowed for this window size");
    } else if (window.innerWidth>1000 && lift>7) {
        alert("At max 6 lift allowed");
    } else {
       createFloors(floor);
       createLifts(lift);
    }
})
