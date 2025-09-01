export class Modal {
    constructor(buttonID, modalID) {
        this.buttonID = document.getElementById(buttonID); 
        this.modal = document.getElementById(modalID);
        this.isShowing = false; 
        this.cancelButton = document.getElementById("cancelButton")


        this.buttonID.addEventListener("click", () => this.toggle())
        this.cancelButton.addEventListener("click", () => this.hide()); 
    }

    show (){
        this.isShowing = true; 
        this.modal.style.display = "flex"; 
        
    }
    hide(){
        this.isShowing = false; 
        this.modal.style.display = "none" 
    }
    toggle() {
        this.isShowing ? this.hide() : this.show(); 
    }
}

export class todo {
    constructor() {
        this.name = document.getElementById(taskName); 
        this.description = document.getElementById(description).value; 
    }

    drawTodo (parent) {
        const newTodo = document.createElement("todo"); 
        parent.appendChild(newTodo)
    }
}