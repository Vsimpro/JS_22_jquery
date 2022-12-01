/* Global Variables */
// For the AJAX call
var settings = {
    "method": "GET",
    "dataType": "json"
}

var readMore = true;

// TODO: Find a way to get these fellas an age aswell?
const case_names = [
    "Chroma", "Chroma 2", "Chroma", "Clutch", "CS20", 
    "CS:GO Weapon Case",  "CS:GO Weapon Case 2",  "CS:GO Weapon Case 3",
    "Danger Zone",  "Dreams & Nightmares",  
    "eSports 2013",  "eSports 2013 Winter Case", "eSports 2014 Summer Case",
    "Falchion", "Fracture", 
    "Gamma", "Gamma 2", "Glove", 
    "Horizon", "Huntsman Weapon Case", 
    "Operation Bravo", "Operation Breakout Weapon", "Operation Broken Fang",
    "Operation Hydra", "Operation Phoenix", "Operation Riptide", 
    "Operation Vanguard Weapon", "Operation Wildfire",
    "Prisma", "Prisma 2", 
    "Recoil", "Revolver",
    "Shadow", "Shattered Web", "Snakebite",
    "Spectrum", "Spectrum 2", "Winter Offensive Weapon"  
] /**/

// API Proxy to try and bypass the rate limitter. 
const steam_API = 'https://api.vsim.xyz/steam/v1'

/* Classes for Items and an array to store them in.*/
class Items {
    constructor() {
        this.array = []
    }
    addItem(Item) {
        this.array.push(Item)
    }
    addResponse(Item) {
        this.responses.push(Item)
    }
}

class Item {
    constructor(name) {
        this.name = name;
        
        this.price;
        this.volume;
        this.hashname;
        this.marketCap;
    }

    createHashname() {
        /* Generate hashname for this case if none exists */
        let hashname = "";
        hashname = this.name.replace("case","Case").replace(" ", "%20")

        if (hashname.includes("Case") != true) {
            hashname = `${hashname} Case`;
        }
        // Double check " " -> 20%
        this.hashname = hashname.replace(" ","%20");
    }

    getPrice() {
        // Awfully ugly code. Forgive me.
        settings["url"] = `${steam_API}/${this.getHashname()}`
        $.ajax(settings).done(function (response) {
            let itemName = Object.keys(response)[0].replace(" Case", ""); 
            let data = response[Object.keys(response)[0]]
            if (data == null) {
                return;
            }
            /* Because I can't seem to find a sensible way to pass 'this' case
             to this function, we must go through the stored objects to find it. */
            for (let i = 0; i < Cases.array.length; i++) {
                var caseObject = Cases.array[i];
                // Parse 'Case' to prevent 'false' due to oddities 
                if (caseObject.name.replace(" Case", "") == itemName) {
                    caseObject.price = data.lowest_price;
                    caseObject.volume = data.volume;
                    break;
                }
            } 
            caseObject.createCard()
        });

        return 0;
    }
    createCard() {
        /* Creates a div element with the info from this template..*/
        let card =  $("<div></div>").addClass("row")
        if (this.price == null || this.volume == null) {
            console.log(this.name + " problem loading data.")
            this.price = "null"
            this.volume = "null"
        }
        
        card.append(
        $("<div></div>").addClass("col-sm-3").html(
       `${this.name}`))
       
        card.append($("<div></div>").addClass("col-sm-3").html(
        `${this.price.replace("--", "00")}`))
        
        card.append($("<div></div>").addClass("col-sm-3").html(
        `${this.volume}`))
            
        card.append($("<div></div>").addClass("col-sm-3").html(
        `${parseInt(
        parseInt(this.volume.replace(",", "").replace(".", "")) 
        * parseFloat(this.price.replace(",", "").replace(".", "").replace("--", "00"))
        / 100)}`    ))
             
        card.hide()
        $("#data").append(card);
        card.slideDown() 
    }

    getHashname() {
        if (this.hashname == undefined || this.hashname == "") {
            this.createHashname()
        }            
        return this.hashname;
    }   
}

function main() {
    /* The mainflow of the code. */
    for (let i = 0; i < case_names.length; i++) {
        let new_case = new Item(`${case_names[i]}`)
        Cases.array.push(new_case)
        new_case.getPrice()
    }
}

var Cases = new Items;

/* Add functionalities to the site */
$(".infobutton").click(function(){
    $("#infobox").slideToggle(1000);
    if (readMore == true) {
        readMore = false;
        $(".infobutton").html("show less");
        return;
    } 
    readMore = true;
    $(".infobutton").html("read more");

  }); 

/* Resume with the Script. */
$(document).ready(main);
