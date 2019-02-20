function NoteView(text, date, inx, dateEdited){
    this.text = text;
    this.dateEdited = dateEdited || "";
    this.inx = inx;
    this.date = date;
    var timer;
    var temp = document.querySelector("#noteTmpl").content;
    this.render = function(){
        var el = temp.cloneNode(true);
        var body = el.querySelector(".toEdit");
        var head = el.querySelector(".notesHead");
        var note = el.querySelector(".notes");
        var footerCreation = el.querySelector(".footerCreation");
        var footerEdition = el.querySelector(".footerEditing");
        head.innerHTML = "<i class=\"fas fa-trash-alt\" data-inx=\"" + this.inx + "\"></i>";
        footerCreation.innerHTML = this.date;
        footerEdition.innerHTML = this.dateEdited;
        var deleteBtn = el.querySelector(".fa-trash-alt");
        body.innerHTML = this.text;
        note.addEventListener('dragstart', function(e){
            var inx = e.target.closest(".notes").querySelector(".fa-trash-alt").dataset.inx;
            pubSub.publish("dragStart", e, inx);
        },false);
        note.addEventListener('dragover', function(e){
            pubSub.publish("dragOver", e)
        },false);
        note.addEventListener('drop', function(e){
            var inx = e.target.closest(".notes").querySelector(".fa-trash-alt").dataset.inx;
            pubSub.publish("dragDrop", e, inx);
        },false);
        deleteBtn.addEventListener("click", function(e){
            var target = parseInt(e.target.dataset.inx, 10);
            var text = e.target.closest(".notes").querySelector(".toEdit").innerHTML;
            var date = e.target.closest(".notes").querySelector(".footerCreation").innerHTML;
            var dateEdit = e.target.closest(".notes").querySelector(".footerEditing").innerHTML;
            pubSub.publish("removing", target, text, date, dateEdit);
        });
        body.addEventListener("focus", function(e){
            e.target.style.backgroundColor = "rgb(110,110,110)";
            var textBefore = e.target.closest(".notes").querySelector(".toEdit").innerHTML;
            var dateEditBefore = e.target.closest(".notes").querySelector(".footerEditing").innerHTML;
            body.addEventListener("keyup", function(e){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    var today = new Date();
                    editDate = "<strong>Edited: </strong>"+ addZero(today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() + " - " + addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds());
                    footerEdition.innerHTML = editDate;
                    var inx = e.target.closest(".notes").querySelector(".fa-trash-alt").dataset.inx;
                    var text = e.target.closest(".notes").querySelector(".toEdit").innerHTML;
                    e.target.style.backgroundColor = "rgb(120,120,120)";
                    pubSub.publish("editing", parseInt(inx, 10), text, textBefore, dateEditBefore, editDate);
                }, 1000);
            });
        });
        body.addEventListener("blur", function(e){
            e.target.style.backgroundColor = "rgb(120,120,120)";
        })
        return el;
    }
}
function View(){
    var container = document.querySelector("#container");
    var btn = document.querySelector("#create");
    var search = document.querySelector("#search");
    var undo = document.querySelector("#btn-undo");
    document.onkeyup = function(e){
        if(e.ctrlKey && e.which === 90){
            pubSub.publish("undo");
        }
    }
    undo.addEventListener("click", function(){
        pubSub.publish("undo");
    });
    search.addEventListener("keyup", function(){
        pubSub.publish("searching", search.value);
    });
    btn.addEventListener("click", function(){
        pubSub.publish("adding");
    });
    function emptyList(){
        container.innerHTML = ""; 
    }
    function singleNote(text, date, inx, dateEdited){
        var noteView = new NoteView(text, date, inx, dateEdited);
        container.appendChild(noteView.render())
    }
    pubSub.subscribe('empty', emptyList);
    pubSub.subscribe('note', singleNote);
}
function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}