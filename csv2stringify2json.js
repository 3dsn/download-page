const https = require('https')
const fs = require('fs')
const caminho = require('path')
const uuidir = require('uuid/v1')
const csv2json = require("csvtojson")

var csvOnline = 'https://prod-edxapp.edx-cdn.org/assets/courseware/\
v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+3T2018\
+type@asset+block/customer-data.csv' // backSlash to break string line.

const downloadCsv = (url = csvOnline) => {
    console.log('donwnloading', url)
    // Event Emitter
    const fetchPage = (arqUrl, retorno) => {
        https.get(arqUrl, (resposta) => {
            let memoria = ''
            resposta.on('data', (pedaco) => {
                memoria += pedaco
            })
            resposta.on('end', () => {
                retorno(null, memoria)
            })
        }).on('error', (error) => {
            console.error(`Tivemos o erro'${error.message}`)
        })
    }
    const folderName = uuidir()
    fs.mkdirSync(folderName)
    fetchPage(url, (error, dados) => {
        if (error) return console.log(error)
        csv2json().fromString(dados).then((jsonArr) => {
            fs.writeFileSync(caminho.join(__dirname, folderName, 'arquivo.json'), JSON.stringify(jsonArr))
            //fs.writeFileSync(caminho.join(__dirname, folderName, 'arq.json'), console.log(jsonArr))
        })
        fs.writeFileSync(caminho.join(__dirname, folderName, 'url.txt'), url)
        console.log('downloading is done in folder ', folderName)
    })
}
downloadCsv(process.argv[2])