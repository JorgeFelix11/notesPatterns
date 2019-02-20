function TodoModel(){
    this.getNotes = function(){
        return JSON.parse(localStorage.note|| "[]");
    }
    this.getNotesSearched = function(){
        return JSON.parse(localStorage.searched || "[]");
    }
    this.removeNote = function(inx) {
        var allNotes = this.getNotes().filter(function(Note, i) {
            return i !== inx;
          });
        localStorage.note = JSON.stringify(allNotes);
    }
    this.editNote = function(inx, text, editDate){
        var allNotes = this.getNotes();
        allNotes[inx].val = text;
        allNotes[inx].dateEdited = editDate;
        localStorage.note = JSON.stringify(allNotes);
    }
    this.editNoteBefore = function(inx, text, dateBefore){
        var allNotes = this.getNotes();
        allNotes[inx].val = text;
        allNotes[inx].dateEdited = dateBefore;
        localStorage.note = JSON.stringify(allNotes);
    }
    this.searchNote = function(value){
        var allNotes = this.getNotes();
        var searched = [];
        for(var i=0; i<allNotes.length; i++){
            var a = allNotes[i].val;
            var found = allNotes[i];
            if(a!==null){
                if(a.indexOf(value) >  -1){     
                    searched.push(found);
                }
            }else{}
        }
        localStorage.searched = JSON.stringify(searched);
    }

    this.saveOrder = function(textDragged, inxDragged, inxDropZone, dateDragged, dateEditDragged){
        var allNotes = this.getNotes();
        var newObj = {val: textDragged, date: dateDragged, dateEdited: dateEditDragged};
        if(inxDragged > inxDropZone){
            allNotes.splice(inxDropZone, 0, newObj);
            for(var i=0; i<allNotes.length; i++){
                if(i === parseInt(inxDragged)){
                    var a = i+1;
                    allNotes.splice(a,1);
                }
            }
        }else{
            var inxDrop = parseInt(inxDropZone) + 1;
            var inxDragged = parseInt(inxDragged);
            allNotes.splice(inxDrop,0, newObj);
            for(var i=inxDragged; i<allNotes.length; i++){
                allNotes[i] = allNotes[i+1];
            }
            allNotes.pop();    
        }
        localStorage.note = JSON.stringify(allNotes);
    }
    this.addNote = function() {
        var allNotes = this.getNotes();
        var today = new Date();
        var newObj = {
            val: "",
            date: "<strong>Created: </strong>"+ addZero(today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() + " - " + addZero(today.getHours()) + ":" + addZero(today.getMinutes()) + ":" + addZero(today.getSeconds()),
            dateEdited: ""
        }
        allNotes.push(newObj);
        localStorage.note = JSON.stringify(allNotes);
    }
    this.addNoteRemoved = function(inx, text, date, dateEdited){
        var allNotes = this.getNotes();
        var newObj = {val: text, date: date, dateEdited: dateEdited}
        allNotes.splice(inx, 0, newObj);
        localStorage.note = JSON.stringify(allNotes);
    }
    this.removeLast = function(){
        var allNotes = this.getNotes();
        allNotes.pop();
        localStorage.note = JSON.stringify(allNotes);
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
  }