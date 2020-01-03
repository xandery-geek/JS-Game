const NORMAL = 1;
const LUCKY_DOG = 0;

var is_start = false;
var is_pause = false;
var clock;
var last_block = null;

function $(no)
{
        return document.getElementById(no);
}

function start()
{
        if(!is_start)  
        {
                init();         //启动
                pause(false);
                is_start = true;
        }
        else if(is_pause)   
        {
                pause(false);   //继续
        }
        else    
        {
                pause(true);    //暂停
        }
}

//初始化拼图
function init()
{        
        var bolock_list = new Array();

        //select a black block randomly
        var lucky_row = Math.floor(Math.random() * 4);
        var lucky_col = Math.floor(Math.random() * 4);
        var row = 0, col = 0;

        var img_containter = $("image");
        var nodes = img_containter.childNodes;

        for(let i=0; i<nodes.length;i++)
        {                
                if(nodes[i].className != "img-row")
                {
                        continue;
                }

                var blocks = nodes[i].childNodes; 
                var row_list = new Array();
                for(let j=0; j<blocks.length;j++)
                {
                        if(blocks[j].className != "img-block")
                        {
                                continue;
                        }

                        blocks[j].row = row;
                        blocks[j].col = col;
                        blocks[j].no = parseInt(blocks[j].innerHTML);

                        //this it the luck dog
                        if(row == lucky_row  && col == lucky_col)
                        {
                                blocks[j].type = LUCKY_DOG;             
                                blocks[j].className += " img-lucky-dog";   
                                blocks[j].innerHTML = "";
                        }
                        else
                        {
                                blocks[j].type = NORMAL;                                
                        }                      
                        col++;
                        row_list.push(blocks[j]);
                }
                row++;
                col = 0;

                bolock_list.push(row_list);
        }        

        generate(bolock_list, lucky_row, lucky_col);

        //鼠标点击事件
        img_containter.onclick = function (ev)
        {
                ev = ev || window.event;
                judge_exchange(ev);
        }
}

function pause(option)
{
        if(option == true)
        {
                var start_but = $("start");
                start_but.className = "start";
                start_but.innerHTML = "Continue Game";
                is_pause = true;
                clearInterval(clock);
        }
        else
        {
                var start_but = $("start");
                start_but.className = "pause";
                start_but.innerHTML = "Pause Game";
                is_pause = false;
                clock = setInterval("onTimer();", 1000);
        }
}

function onTimer()
{
        var timer = $("timer");
        list = timer.innerHTML.split(':');
        minute = parseInt(list[0]);
        second = parseInt(list[1]);

        second ++;
        if(second >= 60)
        {
                second = 0;
                minute ++;
                if(minute >= 60)
                {
                        minute = 0;
                        over(false);
                }
        }

        if(minute >= 50)
        {
                timer.className += " timer-red";        //change the timer color to red, remind player.
        }

        timer.innerHTML = minute.toString() + " : " + second.toString();
}

function over(option)
{
        var timer = $("timer");                    
        timer.className = "timer-style";
                
        var start_but = $("start");
        start_but.className = "start";
        start_but.innerHTML = "Start Game";        
        is_start = false;
        is_pause = false;

        clearInterval(clock);

        if(option == true)
        {
                alert("Good Work! Use Time:" + timer.innerHTML);
        }
        else
        {
                alert("Game Over");
        }

        //reset puzzle
        var no = 1;
        var img_containter = $("image");
        var nodes = img_containter.childNodes;

        for(let i=0; i<nodes.length;i++)
        {                
                if(nodes[i].className != "img-row")
                {
                        continue;
                }

                var blocks = nodes[i].childNodes; 
                for(let j=0; j<blocks.length;j++)
                {
                        if(blocks[j].type == NORMAL || blocks[j].type == LUCKY_DOG)
                        {
                                blocks[j].type = NORMAL;
                                blocks[j].innerHTML = no.toString();
                                blocks[j].className = "img-block";
                                no++;

                        }                        
                }
        }

        //reset timer
        timer.innerHTML = "00:00";
}

function judge_exchange(ev)
{             
        if(ev.target.type == NORMAL || ev.target.type == LUCKY_DOG)
        {                
                if(last_block != null && last_block.type != ev.target.type)
                {
                        if(((last_block.row == ev.target.row) && (Math.abs(ev.target.col - last_block.col) == 1))
                        || ((last_block.col == ev.target.col) && (Math.abs(ev.target.row - last_block.row) == 1)))
                        {
                                exchange(ev.target, last_block);
                                judge_over();
                                last_block = null;
                                return;
                        }                        
                }
                last_block = ev.target;
        }
}

function exchange(target1, target2)
{
        var no = target1.no;
        var html = target1.innerHTML;
        var class_name = target1.className;
        var type = target1.type;

        target1.no = target2.no;
        target2.no = no;
        
        target1.innerHTML = target2.innerHTML;
        target2.innerHTML = html;

        target1.className = target2.className;
        target2.className = class_name;

        target1.type = target2.type;
        target2.type = type;
}

function judge_over()
{
        var no_list = new Array();

        var img_containter = $("image");
        var nodes = img_containter.childNodes;

        for(let i=0; i<nodes.length;i++)
        {                
                if(nodes[i].className != "img-row")
                {
                        continue;
                }

                var blocks = nodes[i].childNodes; 
                for(let j=0; j<blocks.length;j++)
                {
                        if(blocks[j].type == NORMAL || blocks[j].type == LUCKY_DOG)
                        {
                                no_list.push(blocks[j].no);
                        }                        
                }
        }

        //check
        for(let i=0; i<no_list.length -1 ; i++)
        {
                if(no_list[i] > no_list[i+1])
                {
                        return; //no finish
                }
        }

        over(true);        
}

//生成拼图
function generate(blocks, lucky_row, lucky_col)
{
        var row, col;
        var times = Math.floor(Math.random() * 20)+100;

        while(times--)
        {
                var dire = Math.floor(Math.random()*4);
                if(dire == 0)
                {
                        row = lucky_row - 1;
                        col = lucky_col;
                        if(row <0 )
                        {
                                row = lucky_row +1;
                        }
                }
                else if(dire == 1)
                {
                        row = lucky_row;
                        col = lucky_col + 1;
                        if(col > 3 )
                        {
                                col = lucky_col - 1;
                        }
                }
                else if(dire == 2)
                {
                        row = lucky_row + 1;
                        col = lucky_col;
                        if(row > 3)
                        {
                                row = lucky_row - 1;
                        }
                }
                else
                {
                        row = lucky_row;
                        col = lucky_col - 1;
                        if(col < 0)
                        {
                                col = lucky_col + 1;
                        }
                }

                exchange(blocks[lucky_row][lucky_col], blocks[row][col]);
                lucky_row = row;
                lucky_col = col;
        }
}
