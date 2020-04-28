var accordions=document.querySelectorAll('button.accordion');
for(var i=0;i<accordions.length;i++){
    accordions[i].onclick=function(){
        this.classList.toggle("active");
        this.nextElementSibling.classList.toggle("show");
    }
}