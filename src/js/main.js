var notes = {};
const LS_NAME = "quick_notes_ext";
$(document).ready(() => {
    load();
    adjust();
    
    $('#add').click(setNote); 

    $('#clear').click(() => {
        for (let i of $('.node-x')) i.click();
    }); 
});

function setNote() {
    let k = $('#key').val().trim(), v = $('#val').val().trim();

    if (!check(k,v)) return;
    else $('#msg').hide();

    const id = (new Date()).getTime();
    notes[id] = [k,v];
    addNode(k,v,id);

    update();
    $('#nodes').show();
    $('#key').val("");
    $('#val').val("");
}
function check(k,v) {
    ret = true;
    if (!k) {
        $('#msg').text("The title cannot be empty");
        ret = false;
    } else if (!v) {
        $('#msg').text("The note cannot be empty");
        ret = false;
    }
    if (!ret) $('#msg').show();
    else $('#msg').hide();
    return ret;
}

function adjust() {
    $('#nodes').show();
    if ($("#nodes").children().length == 0) {
        $('#nodes').hide();
        $('#msg').text('No notes stored');
        $('#msg').show();
    } else $('#msg').hide();

    $('.node').css('width',$('#nodes').children().length > 8 ? '98%' : '100%');
}

function update() {
    localStorage.setItem(LS_NAME,JSON.stringify(notes));
}

function load() {
    let data = localStorage.getItem(LS_NAME);
    if (!data) {
        localStorage.setItem(LS_NAME,"{}");
        // console.log('set key in local storage');
    } else {
        data = JSON.parse(data);
        notes = data;
        // console.log(data);
        if (Object.keys(data).length > 0) {
            for (let id of Object.keys(data)) addNode(data[id][0],data[id][1],id);
        }
    }
}

function addNode(k,v,id) {
    let key=$('<div></div>'),val=$('<div></div>'),node = $('<div></div>');
    let tools = $('<div></div>'), bck = $('<div></div>');
    
    let key_ed=$('<input></input>').val(k), val_ed=$('<textarea></textarea>').val(v);
    let key_txt=$('<span></span>').text(k), val_txt=$('<span></span>').text(v);

    [key_ed, val_ed].map(i => i.hide());

    key.append(key_txt,key_ed);
    val.append(val_txt,val_ed);

    let x = $('<span></span>').text('x');
    let cb = $('<span></span>').text('📋'); // &#x2398
    let ed = $('<span></span>').text('✏️'); 

    let chk = $('<span></span>').text('✅'); 
    chk.hide();

    key.addClass('node-key');
    val.addClass('node-val');
    node.addClass('node');
    x.addClass('node-x');
	bck.addClass('node-tools-bck');
    val.attr('id',`node-${id}-val`);

    tools.addClass('node-tools');
    tools.append(chk,ed,cb,x,bck);

    node.append(key,val,tools);

    node.hover(() => tools.show());
    node.mouseleave(() => tools.hide());

    x.click(() => {
        delete notes[id];
        update();
        node.remove();
        adjust();
    });

    cb.click(() => {
        let range = document.createRange();
        range.selectNode($(`#node-${id}-val`)[0].firstChild);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range); 
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        $('#msg').text('Copied!');
        $('#msg').show();
        setTimeout(()=>$('#msg').hide(),1000);
    });

    ed.click(() => {
        node.mouseleave(_ => tools.show());
        [ed,cb,x].map(i => i.hide());
        chk.show();

        [key_txt, val_txt].map(i => i.hide());
        [key_ed, val_ed].map(i => i.show());

        key_ed.val(key_ed.val().trim());
        val_ed.val(val_ed.val().trim());

        chk.click(() => {
            if (!check(key_ed.val(),val_ed.val())) return;

            node.mouseleave(_ => tools.hide());
            [ed,cb,x,bck].map(i => i.show());
            chk.hide();

            notes[id] = [key_ed.val(),val_ed.val()];
            // delete notes[key_txt.text()];
            // notes[key_ed.val()] = val_ed.val();

            update();

            key_txt.text(key_ed.val());
            val_txt.text(val_ed.val());

            [key_txt, val_txt].map(i => i.show());
            [key_ed, val_ed].map(i => i.hide());
        });

    });

    $('#nodes').append(node);

    adjust();
}