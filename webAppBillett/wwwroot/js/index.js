﻿
$(  () => {
    //TODO
    hentRuter().then((x) => {


        hentReiseInfoServer().then((ok) => {
            hentPersonInfoServer();
            hentLugarInfoServer();

           
           
            
         
          
        }, (err) => {
            hentPersonInfoServer();
            hentLugarInfoServer(); });

    })
 
    $("#reg0").click((e) => {
        let info = hentReiseInfo();
        let erGyldig = validerReise(info);

        if (erGyldig) {
            lagreReiseInfoServer();
            sendReiseInformasjon(info);

        }
    });

    $("#sokDato").click((e) => {
        hentForekomstDato();
    })

    $("#sokTid").click((e) => {
        hentForekomstDatoTid();
    })
    $("#fulfor").click((e) => {
        lagreBetaling();
    })
    $("#slettLugarer").click((e) => {
        slettLugarer();
    });
    $("#slettBillett").click((e) => {
        slettBillettServer();
    });

    $("#sok").click((e) => {
        hentAlleLugarInfoServer();
    });
    $("#fra").change((e) => {
        let index = $("#fra")[0].selectedIndex;
        $("#til")[0].selectedIndex = index;
    });

    $("#til").change((e) => {
        let index = $("#til")[0].selectedIndex;
        $("#fra")[0].selectedIndex = index;
    });


    $("#endre0").click((e) => {
        let info = hentReiseInfo();
        let erGyldig = validerReise(info);

        if (erGyldig) {
            endreReiseInfoServer(info);

        }
    });



    $("#slettLugarer").click((e) => {
        resetLugarOversikt();
    });


});

//---------GUI
async function endreReiseInfoServer(reiseInfo) {
    const reiseInfo2 = {
        reiseId: 1,
        reisetype: $('#reisetype').val(),
        fra: $('#fra').val(),
        til: $('#til').val(),
        antBarn: $("#antBarn").val(),
        antVoksen: $("#antVoksen").val(),
        avgangsDato: $('#avgangsDato').val(),
        avgangsTid: $('#avgangsTid').val()
    };




    $.post("/billett/endreReiseInformasjon/", reiseInfo2).done((res) => {
        $("#personer").html("");
        genererPersonInfoSkjema(reiseInfo2);
    }).promise();
}


//---------GUI
async function lagreReiseInfoServer() {
    const reiseInfo = {
        reiseId: -1,
        reisetype: $('#reisetype').val(),
        fra: $('#fra').val(),
        antBarn: $("#antBarn").val(),
        antVoksen: $("#antVoksen").val(),
        avgangsDato: $('#avgangsDato').val(),
        avgangsTid: $('#avgangsTid').val()
    };




    $.post("/billett/lagreReiseInformasjon/", reiseInfo).done((res) => {
        GUIModuleSPA.addReiseInfo(1);
        $("#reg0").hide();
        $("#endre0").show();
        if (GUIModuleSPA.testReiseInformasjon()) {
            GUIModuleSPA.changeSchemaState(0, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(0, 2);
        }
    }).promise();
}

async function lagreBetaling() {
    const betalingsInfo = {
        betalingsId: -1,
        csv: $('#csv').val(),
        kortnummer: $('#kortnummer').val(),
        utloper: $('#utloper').val(),

    };




    $.post("/billett/utforBetaling/", betalingsInfo).done((res) => {
        $("#lugarOversikt").html("");
        $("#personer").html("");

        document.getElementById("regform").reset();
        GUIModuleSPA.fjernAlleLugarer();
        GUIModuleSPA.fjernAllePersoner();
        GUIModuleSPA.fjernAlleReiseInformasjon();


    }).promise();
}


async function endrePersonServer(id, skjemaNr) {
    const person2 = {
        personId: $("#personId" + skjemaNr).val(),
        fornavn: $("#fornavn" + skjemaNr).val(),
        etternavn: $("#etternavn" + skjemaNr).val(),
        addresse: $("#addresse" + skjemaNr).val()
    };


    let idVal = id;

    $.post("/billett/endrePerson/", person2).done((res) => {

    }).promise();
}

async function lagrePersonServer(skjemaNr) {


    const person2 = {
        fornavn: $("#fornavn" + skjemaNr).val(),
        etternavn: $("#etternavn" + skjemaNr).val(),
        addresse: $("#addresse" + skjemaNr).val()
    };


    let val = skjemaNr;

    $.post("/billett/lagrePerson/", person2).done((res) => {

        $("#leggTilPerson" + val).hide();
        $("#endrePerson" + val).show();

        GUIModuleSPA.addPersoner(1);
        $("#personId" + val).val(res);
        if (GUIModuleSPA.testAntallPersoner()) {
            GUIModuleSPA.changeSchemaState(2, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(2, 2);
        }
    }).promise();
}



async function hentReiseInfoServer() {

    await $.get("/billett/hentReiseInformasjon/").done((res) => {
        setReiseInfo(res);

        GUIModuleSPA.addReiseInfo(1);

        if (GUIModuleSPA.testReiseInformasjon()) {
            GUIModuleSPA.changeSchemaState(0, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(0, 2);
        }



    }).promise();
}


async function hentForekomstDato() {
    $("#avgangsDato").html("");
    $("#avgangsTid").html("");
    let rute = {
        fra: $("#fra").val(),
        til: $("#til").val()
    }

    await $.post("/billett/hentForekomsterDato/", rute).done((res) => {

        for (i = 0; i < res.length; i++) {
            setDato(res[i].avgangsDato);
        }

        $("#ruteValgt").val(res[0].ruteId);
    } )
    .promise();
}


async function hentForekomstDatoTid() {
    $("#avgangsTid").html("");
    let forekomstDato = {
        ruteId: $("#ruteValgt").val(),
        avgangsDato: $("#avgangsDato").val()
    }
    await $.post("/billett/hentForekomsterDatoTid/", forekomstDato).done((res) => {
 
        for (i = 0; i < res.length; i++) {
            setTid(res[i].avgangsTid);
        }
    }) .promise();
}




async function hentRuter() {

    await $.get("/billett/hentRuter/").done((res) => {

        for (i = 0; i < res.length; i++) {
            setRute(res[i]);
        }


    }).promise();
}

function setRute(rute) {
    $("#fra").append('<option value = "' + rute.fra + '">' + rute.fra + '  (' + rute.fra + '-' + rute.til + ') </option>');
    $("#til").append('<option value = "' + rute.til + '">' + rute.til + '  (' + rute.fra + '-' + rute.til + ') </option>');
}

function setDato(dato) {
    $("#avgangsDato").append('<option value = "' + dato + '">' + dato + ' </option>');
}

function setTid(tid) {
    $("#avgangsTid").append('<option value = "' + tid + '">' + tid + ' </option>');
}
async function velgLugar(id, body,ant) {

    $.get("/billett/velgLugar/" + id).done((res) => {
        GUIModuleSPA.leggTilMaksPlasser(parseInt(ant,10));

        leggTilLugarOversikt(body);


        if (GUIModuleSPA.testAntallLugarer()) {
            GUIModuleSPA.changeSchemaState(1, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(1, 2);
        }

    }).promise();
}

async function hentLugarInfoServer() {

    $.get("/billett/hentLugarer").done((res) => {

        for (i = 0; i < res.length; i++) {
            let lugarHTML =
                ' <div class="card col-md-6"> <img class="card-img-top" src="' + res[i].bildeURL + '"></img> ' +
                ' <div class="card-body">' +
                ' <h5 class="card-title">' + res[i].tittel + '</h5>' +
                '    <p class="card-text"> <strong> Pris:</strong> ' + res[i].pris + ' </p>' +
                '    <p class="card-text"> <strong> Maks antall personer:</strong> ' + res[i].antall + ' </p>' +
                '    <p class="card-text"> ' + res[i].beskrivelse + '</p> ' +
                '    <a href="#" class="btn btn-primary" id = "listeValg' + res[i].lugarId + '">Velg lugar</a> </div>' +
                '    </div> ';
            leggTilLugarOversikt(lugarHTML);
            GUIModuleSPA.leggTilMaksPlasser(res[i].antall);
        }


        if (GUIModuleSPA.testAntallLugarer()) {
            GUIModuleSPA.changeSchemaState(1, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(1, 2);
        }

    }).promise();
}
async function hentAlleLugarInfoServer() {

    $.get("/billett/hentAlleLugarer").done((res) => {


        for (i = 0; i < res.length; i++) {
            let lugarHTML =
                ' <div class="card col-md-6"> <img class="card-img-top" src="' + res[i].bildeURL + '"></img> ' +
                ' <div class="card-body">' +
                ' <h5 class="card-title">' + res[i].tittel + '</h5>' +
                '    <p class="card-text"> <strong> Pris:</strong> ' + res[i].pris + ' </p>' +
                '    <p class="card-text"> <strong> Maks antall personer:</strong> ' + res[i].antall + ' </p>' +
                '    <p class="card-text"> ' + res[i].beskrivelse + '</p> ' +
                '    <a href="#" class="btn btn-primary" id = "listeValg' + res[i].lugarId + '">Velg lugar</a> </div>' +
                '    </div> ';
            leggTilLugarSokOversikt(lugarHTML);
            let val = res[i].lugarId;
            let ant = res[i].antall;
            $("#listeValg" + res[i].lugarId).click((e) => {


                velgLugar(val, lugarHTML,ant);
            });

        }





    }).promise();
}

async function slettLugarer() {

    $.get("/billett/slettLugarer").done((res) => {


        GUIModuleSPA.fjernAlleLugarer();

        if (GUIModuleSPA.testAntallLugarer()) {
            GUIModuleSPA.changeSchemaState(1, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(1, 2);
        }
        $("#lugarOversikt").html("");
    }).promise();
}
async function slettBillettServer() {

    $.get("/billett/slettBillett").done((res) => {
        document.getElementById("regform").reset();

        $("#lugarOversikt").html("");
        GUIModuleSPA.fjernAlleLugarer();
        GUIModuleSPA.fjernAllePersoner();
        GUIModuleSPA.fjernAlleReiseInformasjon();

        if (GUIModuleSPA.testReiseInformasjon()) {
            GUIModuleSPA.changeSchemaState(0, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(0, 2);
        }

        if (GUIModuleSPA.testAntallLugarer()) {
            GUIModuleSPA.changeSchemaState(1, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(1, 2);
        }

        if (GUIModuleSPA.testAntallPersoner()) {
            GUIModuleSPA.changeSchemaState(2, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(2, 2);
        }
    }).promise();
}

async function hentPersonInfoServer() {

    GUIModuleSPA.fjernAllePersoner();
    $.get("/billett/hentPersoner/").done((res) => {

        if (res.length == 0) return;
       GUIModuleSPA.addPersoner(res.length);
        for (i = 0; i < res.length; i++) {
            setPersonInfo(i + 1, res[i]);
            
            $("#endrePerson" + (i + 1)).show();
            $("#leggTilPerson" + (i + 1)).hide();
        }

        if ($("#fornavn1").val() == undefined) {
            setTimeout(hentPersonInfoServer(), 1000);
        }

        if (GUIModuleSPA.testAntallPersoner()) {
            GUIModuleSPA.changeSchemaState(2, 1);
        }
        else {
            GUIModuleSPA.changeSchemaState(2, 2);
        }
    }).promise();


}





function genererPersonInfoSkjema(info) {

    let antBarn = parseInt(info.antBarn, 10);
    let antVoksen = parseInt(info.antVoksen, 10);

    let antPersoner = antBarn + antVoksen;


    //Legger til et nytt person registerings skjema i element med id personer
    for (let i = 1; i <= antPersoner; i++) {

        $('<div class="form-group">' +
            '<label for="person ' + i + ' class="col-sm-3 control-label"> ' +
            ' <h1>Person ' + i + ' </h1> ' +
            '</label>' +
            '<input type = "hidden" id="personId' + i + '"/>' +
            '<label for="fornavn ' + i + ' class="col-sm-3 control-label"> ' +
            '<b>  Fornavn ' + ' </b> ' +
            '</label>' +
            '<div class="col-sm-9">' +
            '   <input type="text" ' +
            '      id="fornavn' + i + '"' +
            '       placeholder="Fornavn"' +
            '       class="form-control"' +
            '       autofocus="" />' +
            ' </div>' +
            '<label for="etternavn ' + i + ' class="col-sm-3 control-label"> ' +
            '<b>  Etternavn ' + ' </b> ' +
            '</label>' +
            '<div class="col-sm-9">' +
            '   <input type="text" ' +
            '      id="etternavn' + i + '"' +
            '       placeholder="Etternavn"' +
            '       class="form-control"' +
            '       autofocus="" />' +
            '<label for="addresse ' + i + ' class="col-sm-3 control-label"> ' +
            '<b>Telefon ' + ' </b> ' +
            ' </div>' +
            '</label>' +
            '<div class="col-sm-9">' +
            '   <input type="tlf" ' +
            '      id="addresse' + i + '"' +
            '       placeholder="Telefon"' +
            '       class="form-control"' +
            '       autofocus="" />' +
            ' </div>' +
            ' <button type="button" class="btn btn-success" id="leggTilPerson' + i + '"' + ' > Legg til </button> ' +
            ' <button type="button" class="btn btn-warning" id="endrePerson' + i + '"' + ' > Endre </button> ' +
            ' </div>' +
            '</div>').appendTo("#personer");

        GUIModuleSPA.settKravAntPersoner(antPersoner);

        $("#endrePerson" + i).click((e) => {
            endrePersonServer(i, i);
        });

        $("#leggTilPerson" + i).click((e) => {
            lagrePersonServer(i)
        });
        $("#endrePerson" + i).hide();
    }
}
function sendReiseInformasjon(info) {

    genererPersonInfoSkjema(info);

}



function validerReise(info) {
    const fra = info.fra;
    const til = info.til;

    if (fra == til) {
        $("#fraFeil").html("Feil! fra og til kan ikke være den samme");
        return false;
    } else {
        return true;
    }
}

function hentReiseInfo() {
    const reiseInfo = {
        reisetype: $('#reisetype').val(),
        fra: $('#fra').val(),
        til: $('#til').val(),
        avgangsDato: $('#avgangsDato').val(),
        avgangsTid: $('#avgangsTid').val(),
        antBarn: $("#antBarn").val(),
        antVoksen: $("#antVoksen").val(),
    };
    return reiseInfo;

}

function leggTilLugarOversikt(html) {

    $(html).appendTo("#lugarOversikt");
}
function leggTilLugarSokOversikt(html) {

    $(html).appendTo("#lugarer");
}
async function setReiseInfo(reiseInfo) {

    $('#reisetype').val(reiseInfo.reisetype);
    $('#antBarn').val(reiseInfo.antBarn);
    $('#antVoksen').val(reiseInfo.antVoksen);
    $('#fra').val(reiseInfo.fra);

    $('#ruteValgt').val($("#fra")[0].selectedIndex);
     await hentForekomstDato();
   
    $('#avgangsDato').val(reiseInfo.avgangsDato);
    
     hentForekomstDatoTid();
    $('#avgangsTid').val(reiseInfo.avgangsTid);
    genererPersonInfoSkjema(reiseInfo);
}

/**
 * 
function initInfo(reiseInfo, infoPersoner, infoLugarer) {
    setReiseInfo(reiseInfo);
    for ((personInfo, idx) in infoPersoner) {
        setPersonInfo(idx + 1, personInfo);
    }
    for (lugar in infoLugarer) {
        let html = ' ';
        leggTilLugarOversikt(html);
    }
}
*/
function setPersonInfo(nummerPerson, personInfo) {
   
    $('#personId' + nummerPerson).val(personInfo.personId);

    $('#fornavn' + nummerPerson).val(personInfo.fornavn);
    $('#etternavn' + nummerPerson).val(personInfo.etternavn);
    $('#addresse' + nummerPerson).val(personInfo.addresse);

}