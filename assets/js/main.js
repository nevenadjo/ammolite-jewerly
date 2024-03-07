//INDEX.HTML

function callback(file, result) {
    try {
        $.ajax({
            type: "get",
            url: "assets/json/" + file,
            dataType: "json",
            success: result,
        });
    } catch (error) {
        alert("An error occurred: ", error.message);
    }
}

var url=location.pathname;

//NAVIGACIJA

function ucitajNav() {
    callback("nav.json", function (data) {
        var url = location.pathname;
        data.forEach((el) => {
            var linkovi=document.createElement("li");
            var anchor = document.createElement("a");
            url.toLocaleLowerCase().includes(el.link) ? anchor.classList.add("activeL") : "";
            anchor.href = el.link; 
            anchor.innerHTML = el.naslov;
            if(el.link == "cart.html"){
                linkovi.classList.add("bold");
            }
            linkovi.appendChild(anchor);
            document.getElementById("list").appendChild(linkovi);
        });
        //responsive-hamburger funkcionalnost
        $("#nav-btn").click(function(){
            $("#nav-list").slideToggle(); 
        });
    });
}

//COVER

//hover funkcinalnost i dinamicki ispis sadrzaja
function cover() {
    callback("coverText.json", function (data) {
        data.forEach((el) => {
            var text=document.createElement("p");
            text.textContent = el.tekst;
            document.getElementById(el.div).appendChild(text);
            text.id=el.div+"1";

            $(`#${el.div}`).hover(function(){
                $(`#${el.div+"1"}`).slideToggle(); 
            });
        });
    });
}
   

$(document).ready(function(){
    ucitajNav();
    if (url == "/" || url == "/index.html") {
        cover();
    }
});


//MAIN

//pri ucitavanju-random izabrane slike iz niza
function imageBlock() {
    var textN=document.createElement("figcaption");
    var textR=document.createElement("figcaption");
    document.getElementById("necklacef").appendChild(textN);
    document.getElementById("ringf").appendChild(textR);

    callback("custom.json", function (data) {
        var br_necklace= Math.floor(Math.random() * data.filter(item => item.type == "necklace").length);
        var br_ring= Math.floor(Math.random() * data.filter(item => item.type == "ring").length);

        document.getElementById("necklace").alt=data.filter(item => item.type == "necklace")[br_necklace].img.alt
        document.getElementById("necklace").src=data.filter(item => item.type == "necklace")[br_necklace].img.src

        document.getElementById("ring").alt=data.filter(item => item.type == "ring")[br_ring].img.alt
        document.getElementById("ring").src=data.filter(item => item.type == "ring")[br_ring].img.src

        textN.textContent = data.filter(item => item.type == "necklace")[br_necklace].img.alt +" - "+ data.filter(item => item.type == "necklace")[br_necklace].price;
        textR.textContent = data.filter(item => item.type == "ring")[br_ring].img.alt +" - "+ data.filter(item => item.type == "ring")[br_ring].price;
    });
}

window.addEventListener("load", function(){
    if (url == "/" || url == "/index.html") {
        imageBlock();
    }
})


//SLIDER

function slider() {
    callback("products.json", function (data) {
        var slider = data.filter(item => item.collection =="gemstone");
       
        slider.forEach((el) => {
            let elD=document.createElement("div");
            elD.classList.add("carousel-item", "w-100");
            let elA=document.createElement("a");
            let elR=document.createElement("img");
            elR.src=el.img.src;
            elR.alt=el.img.alt;
            elA.href="shop.html#" + el.id;
            elA.appendChild(elR);
            elD.appendChild(elA);
            elR.classList.add("d-block", "w-100");
            if(el.type=="necklace"){
                document.querySelector('#carousel-id').appendChild(elD);
            }
            else{
                document.querySelector('#carousel-id1').appendChild(elD);
            }
            if(el.img.src==slider.filter(item => item.type == el.type)[0].img.src){
                elD.classList.add("active");
            }
        })
    });
}


window.addEventListener("load", function(){
    if (url == "/" || url == "/index.html") {
        slider();
    }
})

// TIMER

//funkcija za timer
function updateCountdown() {
    const today = new Date();
    const targetDate = new Date(today.getFullYear(), 2, 31); 
  
    const timeDifference = targetDate.getTime() - today.getTime();
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      return;
    }
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    document.getElementById("time").textContent = `Ends in: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

//prikaz tajmera
$(document).ready(function(){
    if (url == "/" || url == "/index.html") {

        var sale=document.createElement("div");
        sale.classList.add("w-100", "bg-main");
    
        var saleText= document.createElement("p");
        saleText.classList.add("text-center");
        saleText.textContent="Spring Sale On Our Classics";
    
        var saleTime= document.createElement("p");
        saleTime.classList.add("text-center");
        saleTime.id="time";
    
        sale.appendChild(saleText);
        sale.appendChild(saleTime);
        document.getElementById("saleT").appendChild(sale);
      
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
})

//modal
function popuniModal(obj){
    $("#slika").attr("src", obj.img.src);
    $("#slika").attr("alt", obj.img.alt);
    $("#kolicina").attr("data-id", obj.type);
    $("#cart").attr("data-id", obj.id);
    $("#naslov").html(obj.img.alt);
    $("#desc").html(obj.description);
    $("#novaCena").html("$" + obj.price.new);
    obj.price.old == null ? "" : $("#staraCena").html("$" + obj.price.old);
    document.getElementById("kolicina").value=1;
    $("#cartPoruka").addClass("d-none");

}

//kartice za proizvode
function cards(data, div){
    var html="";
    data.forEach((el) => {
        html+=`<div class="card col-12 col-md-3 mb-4 position-relative" id="${el.id}">`;
        el.price.old==null ? html+= "" : html+=`<p class="position-absolute bg-detail p-1">-${el.price.discount}%</p>`
        html+=`<a href="shop.html#${el.id}"><img class="card-img-top" src="${el.img.src}" alt="${el.img.src}"></a>
        <div class="card-body">
        <h5 class="card-title">${el.img.alt}</h5>
        <div class="d-flex justify-content-between">
        <div class="d-flex justify-content-start">`;
        el.price.old==null ? html+= "" : html+=`<p class="card-text stara pe-2 mb-0">$${el.price.old}</p>`
        html+=`<p class="card-text colorD bold">$${el.price.new}</p></div>
        <button type="button" class="border-0 bg-white dugme" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${el.id}" ><i class="fa-solid fa-cart-shopping"></i></button>
        </div>
        </div>
        </div>`
    })
    $(`#${div}`).html(html);
}

//ispis najveci popust
function bestDeals() {
    callback("products.json", function (data) {
        var popust = data.filter(item => item.price.discount != null);
        popust.sort((a, b) => b.price.discount - a.price.discount);
        var p=popust.slice(0,4);
        cards(p,"bestDeals");

        $(".dugme").click(function () {
            let id = $(this).attr("data-id");
            callback("products.json", function (data) {
                let obj=data.filter(item => item.id==id)[0];
                popuniModal(obj);
            })
        })
    });
}

//SHOP

//ispis svih proizvoda
function allProducts(){
    callback("products.json", function (data) {
        cards(data, "products");
        $(".dugme").click(function () {
            let id = $(this).attr("data-id");
            callback("products.json", function (data) {
                let obj=data.filter(item => item.id==id)[0];
                popuniModal(obj);
            })
        })
    })
}

$(document).ready(function(){
    if (url == "/" || url == "/index.html") {
    bestDeals();
    }
})

function sortIspis(){
    callback("sort.json", function (data) {
        var html=`<option  class="p-1" value="0">Sort type</option>`;
        data.forEach((el) => {
            html+=`<option class="p-1" value="${el.id}">${el.sort}</option>`;
        })
        $("#sort").html(html);
    })
}

function setRange(){
    callback("products.json", function (data) {
        let min = data.reduce((min, obj) => (obj.price.new < min ? obj.price.new : min), Infinity);
        let max = data.reduce((max, obj) => (obj.price.new > max ? obj.price.new : max), -Infinity);

        document.getElementById("price").setAttribute("min", min);
        document.getElementById("price").setAttribute("max", max);
        document.getElementById("price").setAttribute("value", max);
        $("#min").html(`$${min} - $`);
        $("#max").html(`${max}`);
    })
}

$(document).ready(function(){
    if (url == "/shop.html") {
        sortIspis();
        allProducts();
        setRange();
    }
})

//filtriranje
$("#formaFilter").on("change keyup", function(){
    callback("products.json", function (data) {
        nizForma = Array.from(document.getElementsByTagName("input"));
        nizForma.forEach((el) => {
            if(el.value != "" && el.value){
                if(el.id=="price"){
                    let html=`${el.value}`;
                    $("#max").html(html);
                    data = data.filter(item => item.price.new <= el.value)
                }
                if(el.id=="search" && el.value!=""){
                    data = data.filter(item => item.img.alt.toUpperCase().includes(el.value.toUpperCase()))
                }
            }
            if(el.checked){
                function chBox(name){
                    let type = Array.from(document.getElementsByName(name))
                    type=type.filter(item => item.checked);
                    if(type.length == 1){
                        return true;
                    }
                    return false;
                }
                if(el.name=="typeCh" && chBox("typeCh")){
                    data = data.filter(item => item.type == el.id)
                }
                if(el.name=="matCh" && chBox("matCh")){
                    data = data.filter(item => item.material == el.id)
                }
                if(el.name=="collCh" && chBox("collCh")){
                    data = data.filter(item => item.collection == el.id)
                }
                if(el.id=="discount"){
                    data = data.filter(item => item.price.discount != null)
                }
            }
        })
        if(data.length==0){
            let html=`<p class="text-center mt-2">No items.</p>`;
            $("#products").html(html);
        } else{
            let select = document.getElementById("sort").selectedIndex
            if(select!=0){
                data = sort(select, data);
            }
            cards(data, "products");
            $(".dugme").click(function () {
                let id = $(this).attr("data-id");
                callback("products.json", function (data) {
                    let obj=data.filter(item => item.id==id)[0];
                    popuniModal(obj);
                })
            })
        }
    })
})

//sortiranje
function sort(id, data){
    switch (id) {
        case 1: 
            data.sort((a, b) => {
                const nameA = a.img.alt.toUpperCase(); 
                const nameB = b.img.alt.toUpperCase(); 
                if (nameA < nameB) {
                return -1;
                }
                if (nameA > nameB) {
                return 1;
                }
                return 0;
            });
            break;
        case 2:
            data.sort((a, b) => {
                const nameA = a.img.alt.toUpperCase(); 
                const nameB = b.img.alt.toUpperCase(); 
                if (nameA > nameB) {
                return -1;
                }
                if (nameA < nameB) {
                return 1;
                }
                return 0;
            });
            break;
        case 3:
            data.sort((a, b) => a.price.new - b.price.new);
            break;
        case 4:
            data.sort((a, b) => b.price.new - a.price.new);
            break;
        case 5:
            data.sort((a, b) => b.price.discount - a.price.discount)
            break;
    }
    return data;
}



function resetFilter(){
    setRange()
    allProducts()
}

$("#reset").on("click", resetFilter)

$("#btn-filter").click(function(){
    $("#filter").slideToggle(); 
})

//CART

$("#cart").on("click", function(){
    localStorage.setItem($("#cart").attr("data-id"), document.getElementById("kolicina").value);
    $("#cartPoruka").removeClass("d-none");

    var keys = Object.keys(localStorage);
    var brojStavki = keys.length;

    $("#stavke").html(` (${brojStavki})`);
})

window.onload=function(){
    var keys = Object.keys(localStorage);
    var brojStavki = keys.length;
    if(brojStavki>0){
    $("#stavke").html(` (${brojStavki})`);
    }
}

function ispisCart(){
    var keys = Object.keys(localStorage);
    var brojStavki = keys.length;
    var cena =0;
    if(brojStavki==0){
        $("#cartProducts").html(`<p class="text-center m-5">No products.</p>`);
        $("#total").html("");
    }
    else{
        callback("products.json", function(data){
            var html=` <table class="w-100 p-5 ">
            <thead>
                <tr class="border-bottom">
                    <td>Num</td>
                    <td>Product</td>
                    <td>Product Name</td>
                    <td>Price</td>
                    <td>Quantity</td>
                    <td>Delete</td>
                </tr>
            </thead>
            <tbody>`;
            let br=1;
            keys.forEach(function(key) {
                let stavka = localStorage.getItem(key);
                html+=`
                    <tr class="border-bottom">
                        <td>${br}</td>
                        <td class="w-td"><img src="${data.filter(x=> x.id == key)[0].img.src}" alt="${data.filter(x=> x.id == key)[0].img.alt}" id="slika" class="roundedSlika"></td>
                        <td>${data.filter(x=> x.id == key)[0].img.alt}</td>
                        <td>$${data.filter(x=> x.id == key)[0].price.new}</td>
                        <td><input type="number" id="k${key}" data-id="" value="${stavka}" class="px-1 m-1 kolicinaCart" min="1" style="width: 3em" oninput="updateLocal(${key})"></td>
                        <td><button class="delete border-0 bg-white" onclick="deleteFromCart(${key})" id="${key}"><i class="fa-regular fa-trash-can"></i></button></td>
                    </tr>`;
                br++;
                cena+=data.filter(x=> x.id == key)[0].price.new*stavka;
            })
            html+=`</tbody>
            </table>`
            $("#cartProducts").html(html);

            //cena
            var cenaTotal=0;
            var price=`<h6 class="colorD bold mt-3">Total Price:</h6>
            <p id="cenaI">$${cena}.00</p>
            <p>Shipping: $<span id="cenaS">`;
            cena >= 150 ? price+="0" : price+="15"
            cena >= 150 ? cenaTotal=cena : cenaTotal=cena+15
            price+=`.00</span></p>
            <p class="p-message">Free Shipping Over $150</p>
            <p id="cenaT" class="bold colorD">$${cenaTotal}.00</p>
            <button class="btn btn-secondary mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal">ORDER</button>`
            $("#total").html(price);

        })
    }
}

function orderStuff(){
    var keys = Object.keys(localStorage);
    keys.forEach((el) => {
        localStorage.removeItem(el);
    })
    ispisCart();
    $("#stavke").html(``);
}

function updateLocal(key){
    localStorage.setItem(key, document.getElementById(`k${key}`).value);
    ispisCart();
}

function deleteFromCart(id){
    localStorage.removeItem(id);
    ispisCart();
    var keys = Object.keys(localStorage);
    if(keys.length==0){
        $("#stavke").html(``);
    }
    else{
        $("#stavke").html(` (${keys.length})`);
    }
}

$(document).ready(function(){
    if (url == "/cart.html") { 
        ispisCart();
    }
})


//FOOTER

function footer() {
    callback("footer.json", function (data) {

        var divSocials= document.createElement("div");
        var divDoc= document.createElement("div");
        var divLogo= document.createElement("div");
        divSocials.classList.add("col-4");
        divDoc.classList.add("col-4");
        divLogo.classList.add("col-4");

        var ime=document.createElement("p");
        ime.textContent="Socials: ";
        
        var ime1=document.createElement("p");
        ime1.textContent="Docs: ";

        function futerBlok(niz,ime){
                for(element of niz){
                    let link=document.createElement("a");
                    link.classList.add("text-decoration-none", "m-1", "mainC");
                    link.innerHTML=element.icon;
                    link.href=element.href;
                    ime.appendChild(link);
                }
        }
        futerBlok(data.filter(item => item.type == "socials"), ime);
        divSocials.appendChild(ime);
        futerBlok(data.filter(item => item.type == "docs"), ime1);
        divDoc.appendChild(ime1);

        var linkLogo=document.createElement("a");
        linkLogo.href="index.html";
        linkLogo.classList.add("text-decoration-none", "m-1");
        var logoF=document.createElement("img");
        logoF.src="assets/img/logo.png";
        logoF.alt="logo";
        logoF.style.width="40px";
        linkLogo.appendChild(logoF);
        divLogo.appendChild(linkLogo);


        document.getElementById("futer").appendChild(divSocials);
        document.getElementById("futer").appendChild(divLogo);
        document.getElementById("futer").appendChild(divDoc);
        
    });
}
window.addEventListener("load", function(){
    footer();
})

//plug-in jquery Scroll-Up button 
$(document).ready(function() {
    $('#scrollUp').click(function() {
      $.scrollTo(0, 100); 
    });
  
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('#scrollUp').fadeIn();
      } else {
        $('#scrollUp').fadeOut();
      }
    });
  });


//CONTACT

//kreiranje elemenata
$(document).ready(function(){
    if (url == "/contact.html") { 
        var objImg1={src: "assets/img/necklaces1.png", alt: "necklaces"};
        var objImg2={src: "assets/img/necklaces2.png", alt: "necklaces"};

        var tekstFormaBlok1= document.createElement("div");
        tekstFormaBlok1.classList.add("col-12");
        var tekstFormaP1= document.createElement("p");
        tekstFormaP1.id="formaP";
        tekstFormaP1.textContent="Here is a quiz-style form to help you find your dream jewelry!";
        tekstFormaBlok1.appendChild(tekstFormaP1);

        var tekstFormaBlok2= document.createElement("div");
        tekstFormaBlok2.classList.add("col-12");
        var tekstFormaP2= document.createElement("p");
        tekstFormaP2.textContent="Share your preferences, and let us assist you in discovering the jewelry that complements your distinct charm.";
        tekstFormaBlok2.appendChild(tekstFormaP2);

        var tekstFormaBlok3= document.createElement("div");
        tekstFormaBlok3.classList.add("col-11");
        var tekstFormaImg= document.createElement("img");
        tekstFormaImg.alt=objImg1.alt;
        tekstFormaImg.src=objImg1.src;
        tekstFormaImg.classList.add("w-100");
        tekstFormaBlok3.appendChild(tekstFormaImg);

        var tekstFormaBlok4= document.createElement("div");
        tekstFormaBlok4.classList.add("col-11");
        var tekstFormaImg1= document.createElement("img");
        tekstFormaImg1.alt=objImg2.alt;
        tekstFormaImg1.src=objImg2.src;
        tekstFormaImg1.classList.add("w-100");
        tekstFormaBlok4.appendChild(tekstFormaImg1);

        document.getElementById("tekstForma").appendChild(tekstFormaBlok1);
        document.getElementById("tekstForma").appendChild(tekstFormaBlok3);
        document.getElementById("tekstForma").appendChild(tekstFormaBlok2);
        document.getElementById("tekstForma").appendChild(tekstFormaBlok4);


        //funkcija za checkbox
        function unosCh(){
            callback("chbox.json", function (data) {
                for(element of data){
                    let elCh= document.createElement("div");
                    elCh.classList.add("col-lg-4", "col-6");
                    let InCh= document.createElement("input");
                    InCh.type="checkbox";
                    InCh.id=element.id;
                    let laCh= document.createElement("label");
                    laCh.htmlFor=element.id;
                    laCh.textContent=element.name;
                    elCh.appendChild(InCh);
                    elCh.appendChild(laCh);
                    document.getElementById("checkGem").appendChild(elCh);
                }
            })
        }

        //funkcija za dropdown listu
        function unosDdl(){
            callback("ddl.json", function (data) {
                for(element of data){
                    let elDdl= document.createElement("option");
                    elDdl.value=element.value;
                    elDdl.id=element.id;
                    elDdl.textContent=element.value;
                    document.getElementById("style").appendChild(elDdl);
                }
            })
        }

        if(document.getElementById("forma")){
            unosCh();
            unosDdl();
        }

        //expandable menu
        if(document.getElementById("questions")){
            $(document).ready(function(){
                $( '#menu > li > ul' )
                    .hide()
                    .click(function( e ){
                        e.stopPropagation();
                    });
                    $('#menu > li > a').click(function (e) {
                        e.preventDefault();
                        var $submenu = $(this).siblings('ul');
                        $submenu.slideToggle();
                    });
            });
        }
    }
    if(url =="/contact.html" || url == "/cart.html"){

        //form validation
        var regExImePrezime =/^[A-ZŠĐŽĆČ][a-zžđšćč]{1,}(\s[A-ZŠĐŽĆČ][a-zžđšćč]{1,})*/;
        var regExMejl =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        var fName=document.getElementById("fName");
        var ime=document.getElementById("ime");
        var prezime=document.getElementById("prezime");
        var submit=document.getElementById("submit");
    

        //ime
        var mess = document.createElement("p");
        mess.textContent="At least 2 letters with the capital first letter.";
        mess.classList.add("p-message");
        ime.appendChild(mess);
        mess.classList.add("d-none");

        fName.addEventListener("change", function(){
            if(!regExImePrezime.test(fName.value)){
                mess.classList.remove("d-none");
                }
            else{
                mess.classList.add("d-none");
                    
            }
        })

        //prezime
        var mess1 = document.createElement("p");
        mess1.textContent="At least 2 letters with the capital first letter.";
        prezime.appendChild(mess1);
        mess1.classList.add("p-message");
        mess1.classList.add("d-none");

        lName.addEventListener("change", function(){
            if(!regExImePrezime.test(lName.value)){
                mess1.classList.remove("d-none");
                }
            else{
                mess1.classList.add("d-none");
                    
            }
        })

        //mejl
        var mess2 = document.createElement("p");
        mess2.textContent="Needs usual format of a mail.";
        mejl.appendChild(mess2);
        mess2.classList.add("d-none");
        mess2.classList.add("p-message");

        mail.addEventListener("change", function(){
            if(!regExMejl.test(mail.value)){
                mess2.classList.remove("d-none");
                }
            else{
                mess2.classList.add("d-none");
            }
        })
    }
    if(url =="/contact.html"){
        //style
        var mess3 = document.createElement("p");
        mess3.textContent="Style has to be selected.";
        stil.appendChild(mess3);
        mess3.classList.add("p-message");
        mess3.classList.add("d-none");

        style.addEventListener("change", function(){
            if(style.selectedIndex==0){
                mess3.classList.remove("d-none");
            }
            else{
                mess3.classList.add("d-none");
            }
        })

        //button 
        $("#submit").on("click", function(){
            if(style.selectedIndex==0 && !regExMejl.test(mail.value) && !regExImePrezime.test(fName.value) && !regExImePrezime.test(lName.value)){
                let nizP = Array.from(document.getElementsByClassName("p-message"));
                nizP.forEach((el) => {
                    el.classList.remove("d-none")
                })
            }
            else if(style.selectedIndex!=0 && regExMejl.test(mail.value) && regExImePrezime.test(fName.value) && regExImePrezime.test(lName.value)){
               document.getElementById("succ").classList.remove("d-none")
            }
        })
    }

    if(url =="/cart.html"){

        regexAdd = /^[0-9a-zA-Z\s,.'-]+$/;

        //address
        var mess3 = document.createElement("p");
        mess3.textContent="Enter your address.";
        document.getElementById("address").appendChild(mess3);
        mess3.classList.add("p-message");
        mess3.classList.add("d-none");

        document.getElementById("adresa").addEventListener("change", function(){
            if(!regexAdd.test(document.getElementById("adresa").value)){
                mess3.classList.remove("d-none");
            }
            else{
                mess3.classList.add("d-none");
            }
        })

        //button 
        $("#submit").on("click", function(){
            if(!regexAdd.test(document.getElementById("adresa").value) && !regExMejl.test(mail.value) && !regExImePrezime.test(fName.value) && !regExImePrezime.test(lName.value)){
                let nizP = Array.from(document.getElementsByClassName("p-message"));
                nizP.forEach((el) => {
                    el.classList.remove("d-none")
                })
            }
            else if(regexAdd.test(document.getElementById("adresa").value) && regExMejl.test(mail.value) && regExImePrezime.test(fName.value) && regExImePrezime.test(lName.value)){
               document.getElementById("succ").classList.remove("d-none")
               orderStuff();
            }
        })
    }
})


 