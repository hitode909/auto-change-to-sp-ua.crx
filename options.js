(function () {
    var Fields = ['ua', 'width']

    document.addEventListener('DOMContentLoaded', function () {
        Fields.forEach(function (name) {
            document.querySelector('#' + name).value = localStorage[name];
        });
    });

    document.querySelector('#save').addEventListener('click', function () {
        Fields.forEach(function (name) {
            var ret = document.querySelector('#' + name).value;
            if (! ret) return;
            localStorage[name] = ret;
        });

        var status = document.querySelector('#status');
        status.innerHTML = 'Options Saved.';
        setTimeout(function() {
            status.innerHTML = '';
        }, 750);
    });
})();
