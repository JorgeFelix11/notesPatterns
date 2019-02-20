function notesPresenter(){
    var view = new View();
    var model = new TodoModel();
    var dragSrcEl = null;
    var undoManager = new UndoManager();

    function addNote(){
        model.addNote();
        pubSub.publish("updating");
        undoManager.add({
            undo: function(){
                pubSub.publish("removeLast");
            }
        })
    }
    function undo(){
        undoManager.undo();
    }
    function searchNote(value){
        if(value){
            model.searchNote(value);
            pubSub.publish("updatingForSearch");
        }else{
            pubSub.publish("updating");
        }
    }
    function removeNote(inx, text, date, dateEdit){
        model.removeNote(inx);
        pubSub.publish("updating");
        undoManager.add({
            undo: function(){
                model.addNoteRemoved(inx, text, date, dateEdit);
                pubSub.publish("updating");
            }
        })
    }
    function editNote(e, text, textBefore, dateBefore, editDate){
        model.editNote(e, text, editDate);
        undoManager.add({
            undo: function(){
                model.editNoteBefore(e, textBefore, dateBefore);
                pubSub.publish("updating");
            }
        })
    }
    function updateList(){
        pubSub.publish("empty");
        model.getNotes().forEach(function(text,inx){
            pubSub.publish("note", text.val, text.date, inx, text.dateEdited);
        })

    }
    function updateListSearched(){
        pubSub.publish("empty");
        model.getNotesSearched().forEach(function(text, inx){
            pubSub.publish("note", text.val, text.date, inx, text.dateEdited);
        });
    }

    function removeLast(){
        model.removeLast();
        pubSub.publish("updating");
    }

    function handleDragStart(e, inx) {
        dragSrcEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.children[1].children[0].innerHTML);
        e.dataTransfer.setData('date/html', e.target.children[1].children[1].innerHTML);
        e.dataTransfer.setData('dateEdit/html', e.target.children[1].children[2].innerHTML);
        e.dataTransfer.setData('id', inx);
    }
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
    }
    function handleDrop(e, inxDrop) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var textDragged = e.dataTransfer.getData('text/html');
        var inxDragged = e.dataTransfer.getData('id');
        var dateDragged = e.dataTransfer.getData('date/html');
        var dateEditDragged = e.dataTransfer.getData('dateEdit/html');
        var inxDropZone = inxDrop;
        dragSrcEl.innerHTML = e.target.outerHTML;
        e.target.innerHTML = textDragged;
        model.saveOrder(textDragged, inxDragged, inxDropZone, dateDragged, dateEditDragged);
        pubSub.publish("updating");
        undoManager.add({
            undo: function(){
                model.saveOrder(textDragged, inxDropZone, inxDragged, dateDragged, dateEditDragged);
                pubSub.publish("updating");
            }
        })
    }

    pubSub.subscribe("undo", undo);
    pubSub.subscribe("removeLast", removeLast);
    pubSub.subscribe("dragStart", handleDragStart);
    pubSub.subscribe("dragOver", handleDragOver);
    pubSub.subscribe("dragDrop", handleDrop);
    pubSub.subscribe("removing", removeNote);
    pubSub.subscribe("updating", updateList);
    pubSub.subscribe("editing", editNote);
    pubSub.subscribe("searching", searchNote);
    pubSub.subscribe("updatingForSearch", updateListSearched);
    pubSub.subscribe("adding", addNote);
    pubSub.publish("updating");
}
