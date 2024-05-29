const form = document.getElementById('form');

function rand(x){
    return Math.floor(Math.random()*x);
}

function cmp1(a, b) {
    if(a[0]>b[0]) return 1
    if(a[0]==b[0]) return 0
    if(a[0]<b[0]) return -1
}

function cmp2(a, b) {
    if(a>b) return 1
    if(a==b) return 0
    if(a<b) return -1
}

function split_N(a, b){
    var x1=[]
    for(var i=1;i<a;i++) x1.push([Math.random(), i])
    x1.sort(cmp1)
    var x2=[0, a]
    for(var i=0;i<b-1;i++) x2.push(x1[i][1])
    x2.sort(cmp2)
    var an=[]
    for(var i=1;i<=b;i++) an.push(x2[i]-x2[i-1])
    return an
}

function split_N0(a, b){
    if(a == 0) {
        var an=[]
        for(var i=0;i<b;i++) an.push(0);
        return an
    }
    var x2=[0, a]
    for(var i=0;i<b-1;i++) x2.push(rand(a))
    x2.sort(cmp2)
    var an=[]
    for(var i=1;i<=b;i++) an.push(x2[i]-x2[i-1])
    return an
}

function gtree(n){
    var gr=[]
    for(var i=0;i<n;i++) gr.push([])
    for(var i=1;i<n;i++) {
        var x=rand(i)
        gr[x].push(i)
        gr[i].push(x)
    }
    return gr
}

function gen_rand_comp_n_m(n, m){
    if (m < n - 1 || (n * (n - 1)) / 2 < m) {
        return [];
    }
    var edges=[]
    var gr=gtree(n)
    m-=n-1
    for(var i=0;i<n;i++){
        for(var j=0;j<i;j++){
            var f=0
            for(var x of gr[i]) if(x==j) f=1;
            if(f) continue
            edges.push([Math.random(), i, j])
        }
    }
    edges.sort(cmp1)
    for(var i=0;i<m;i++){
        gr[edges[i][1]].push(edges[i][2])
        gr[edges[i][2]].push(edges[i][1])
    }
    return gr
}

function min(a, b){
    if(Number(a)<Number(b))  return a
    return b
}

function gen_rand_gr_n_m_c(n, m, c){
    if((c>n) || m<(n-c)){
        return [];
    }
    var comps = split_N(n, c)
    m-=n-c;
    var edges = split_N0(m, c)
    var su=0
    var gr=[]
    for(var i=0;i<n;i++) gr.push([])
    for(var i=0;i<c;i++){
        var g=gen_rand_comp_n_m(comps[i], comps[i]-1 + min((comps[i]*(comps[i]-1))/2 - (comps[i]-1), edges[i]));
        if(g.length==0) return [[-1]]
        for(var j=0;j<comps[i];j++){
            for(var k of g[j]){
                gr[j+su].push(k+su)
            }
        }
        su+=comps[i]
    }
    return gr
}

function draw_point(x, y, I){
    var canvas = document.getElementById('c1')
    var ctx=canvas.getContext('2d')
    var pi=Math.PI
    ctx.fillStyle = 'grey'
    ctx.strokeStyle = 'black'
    ctx.lineWidth=5
    ctx.moveTo(x, y)
    ctx.arc(x, y, 25, 0, 2*pi, true)
    ctx.stroke()
    ctx.fill()
}

function drawline(x1, y1, x2, y2){
    var canvas = document.getElementById('c1')
    var ctx=canvas.getContext('2d')
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.lineWidth=10
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2);
    ctx.stroke()
    ctx.closePath()
}

function drawnum(x, y, I){
    var canvas = document.getElementById('c1')
    var ctx=canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.font = "30px Arial";
    if(I<10) {
        ctx.fillText(I,x+15-25,y+10);
    }
    else {
        ctx.fillText(I,x+15-32,y+10);
    }
}

function getFormValue(event) {
    var pi=Math.PI
    event.preventDefault();
    var n=Number(form.querySelector('[name="n"]').value)
    var m=Number(form.querySelector('[name="m"]').value)
    var c=Number(form.querySelector('[name="c"]').value)
    var gr=gen_rand_gr_n_m_c(n, m, c)
    var M=0;
    for(var i of gr){
        M+=i.length
    }
    M/=2
    var OUT = document.getElementById("out")
    OUT.innerHTML=n+' '+M+'<br>'
    for(var i =0;i<n;i++){
        for(var j of gr[i]){
            if(i<j){
                OUT.innerHTML+=(j+1)+' '+(i+1)+'<br>'
            }
        }
    }

    var canvas = document.getElementById('c1')
    var ctx=canvas.getContext('2d')
    ctx.clearRect(0, 0, 5000, 500)
    if(M==0){
        console.log('ok')
        ctx.clearRect(0, 0, 5000, 500)
    }
    var c=[]
    var M=0;
    for(var i=0;i<n;i++){
        var f=0
        for(var j of gr[i]){
            if(j<i){
                f=1
                M++
                c[c.length-1]++;
                break
            }
        }
        if(f) continue
        c.push(1)
    }
    var xy=[]
    for(var i=0;i<c.length;i++){
        for(var j=0;j<c[i];j++){
            xy.push([Math.floor(Math.cos((2*pi/c[i])*j)*200)+250+i*500, Math.floor(Math.sin(((2*pi)/c[i])*j)*200)+250])
            //console.log([Math.floor(Math.cos(2*pi/c[i])*100)+250+i*250, Math.floor(Math.sin(2*pi/c[i])*100)+250])
        }
    }
    for(var i=0;i<n;i++){
        for(var j of gr[i]){
            drawline(xy[i][0], xy[i][1], xy[j][0], xy[j][1])
        }
    }
    for(var i=0;i<n;i++) draw_point(xy[i][0], xy[i][1], i+1)
    for(var i=0;i<n;i++) drawnum(xy[i][0], xy[i][1], i+1)
}

function foo() {
    var pi=Math.PI
    var OUT = document.getElementById("out")
    if(OUT.innerHTML=='') return
    var gr=[]
    var n=-1, m=-1;
    var A=-1;
    var x=0;
    for(var i=0;i<OUT.innerHTML.length;i++){
        if(OUT.innerHTML[i]<='9' && OUT.innerHTML[i]>='0') {
            x=x*10+(OUT.innerHTML[i]-'0')
        }
        else {
            if(n==-1){
                n=x;
                for(var j=0;j<n;j++) gr.push([]);
                x=0;
                continue;
            }
            if(m==-1){
                m=x;
                x=0;
                continue;
            }
            if(x==0) continue
            x--;
            if(A==-1){
                A=x;
                x=0
            }
            else{
                gr[A].push(x)
                gr[x].push(A)
                A=-1;
                x=0
            }
        }
    }
    if(n==-1){
        n=x;
        for(var j=0;j<n;j++) gr.push([]);
        x=0;
    }
    else if(m==-1){
        m=x;
        x=0;
    }
    else if(x!=0) {
        x--;
        if(A==-1){
            A=x;
        }
        else{
            gr[A].push(x)
            gr[x].push(A)
            A=-1;
        }
    }

    var canvas = document.getElementById('c1')
    var ctx=canvas.getContext('2d')
    ctx.clearRect(0, 0, 5000, 500)
    var c=[]
    for(var i=0;i<n;i++){
        var f=0
        for(var j of gr[i]){
            if(j<i){
                f=1
                c[c.length-1]++;
                break
            }
        }
        if(f) continue
        c.push(1)
    }
    var xy=[]
    for(var i=0;i<c.length;i++){
        for(var j=0;j<c[i];j++){
            xy.push([Math.floor(Math.cos((2*pi/c[i])*j)*200)+250+i*500, Math.floor(Math.sin(((2*pi)/c[i])*j)*200)+250])
        }
    }
    for(var i=0;i<n;i++){
        for(var j of gr[i]){
            drawline(xy[i][0], xy[i][1], xy[j][0], xy[j][1])
        }
    }
    for(var i=0;i<n;i++) draw_point(xy[i][0], xy[i][1], i+1)
    for(var i=0;i<n;i++) drawnum(xy[i][0], xy[i][1], i+1)
}

form.addEventListener('submit', getFormValue);

function copyText() {
    var ans=''
    var OUT = document.getElementById("out")
    if(OUT.innerHTML=='') return
    var x='';
    var y='';
    for(var i=0;i<OUT.innerHTML.length;i++){
        if(OUT.innerHTML[i]<='9' && OUT.innerHTML[i]>='0') {
            x+=OUT.innerHTML[i]
        }
        else {
            if(y==''){
                y=x
                x=''
                continue
            }
            ans+=y+' '+x+'\n';
            x=''
            y=''
        }
    }
    ans+=y+' '+x+'\n';
    
    navigator.clipboard.writeText(ans);
}

