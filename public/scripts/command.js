var UndoManager = function() {
    var commands = [];
    var index = -1;
    var callback;
    var execute;
    execute = function(command, action) {
        command[action]();
    };
    return {
        add: function (command) {
            commands.splice(index + 1, commands.length - index);
            commands.push(command);
            index = commands.length - 1;
            if (callback) {
                callback();
            }
            return this;
        },
        undo: function () {
            var command = commands[index];
            if (!command) {
                return this;
            }
            execute(command, "undo");
            index -= 1;
            if (callback) {
                callback();
            }
        },
        getCommands: function () {
            return commands;
        },
    };
};
