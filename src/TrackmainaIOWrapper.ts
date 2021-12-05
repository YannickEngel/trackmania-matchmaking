import { RowValues } from "exceljs";
import {entryJson, specMatchData, pageRes, TrackmaniaIO} from './TrackmaniaIOInterface';
import {Config, ConfigObject} from './Config/Config'
import { convertToObject } from "typescript";


const fetch = require('node-fetch')
const ExcelJS = require('exceljs')
const fs = require('fs')

export class TM_IO_Wrapper implements TrackmaniaIO{

    config: ConfigObject;

    private maxPage: number;
    private headers
    private options


    //TODO generate it according to current campaing
    urlToMap = ["https://prod.trackmania.core.nadeo.online/storageObjects/ebb9c74a-5387-446e-ba6c-c372c854985e",     //1 
                "https://prod.trackmania.core.nadeo.online/storageObjects/5440301f-467b-49b9-8e8e-ba67f5ef194a",     //2
                "https://prod.trackmania.core.nadeo.online/storageObjects/66abcddf-1d76-4fc0-92d5-5042125d19d3",     //3
                "https://prod.trackmania.core.nadeo.online/storageObjects/88d9a585-2f9b-4ac0-aab1-7b5df68c9021",     //4
                "https://prod.trackmania.core.nadeo.online/storageObjects/69754627-5f47-4051-911a-89843635bf6b",     //5
                "https://prod.trackmania.core.nadeo.online/storageObjects/aa27e121-e4f1-4bf5-80f4-e529c1a41220",     //6
                "https://prod.trackmania.core.nadeo.online/storageObjects/61b229e9-8e30-4a88-88b9-1ddf8380f3d4",     //7
                "https://prod.trackmania.core.nadeo.online/storageObjects/58e0ed22-1ef8-4886-932c-7a29d0eaa546",     //8
                "https://prod.trackmania.core.nadeo.online/storageObjects/e421e6cb-fd7f-40c9-afc8-2b6b612f9841",     //9
                "https://prod.trackmania.core.nadeo.online/storageObjects/96b4f451-c549-47d6-bb61-4bf757496a40",     //10
                "https://prod.trackmania.core.nadeo.online/storageObjects/d216d68b-ec80-4a41-88ac-0fb2f2fb1005",     //11
                "https://prod.trackmania.core.nadeo.online/storageObjects/9c60b153-b18f-4e95-94fe-a04b858e48f2",     //12
                "https://prod.trackmania.core.nadeo.online/storageObjects/e40422ef-2086-4879-bb71-8558b66cc804",     //13
                "https://prod.trackmania.core.nadeo.online/storageObjects/a47c5651-ab57-4475-9521-194935092a8b",     //14
                "https://prod.trackmania.core.nadeo.online/storageObjects/5a384434-7fe9-420b-bdcf-0d41efa63e46",     //15
                "https://prod.trackmania.core.nadeo.online/storageObjects/c18375d0-38b7-4d7d-b2b5-deb23b783d94",     //16
                "https://prod.trackmania.core.nadeo.online/storageObjects/7612891b-17d8-4229-b786-9b2e33e36c0c",     //17
                "https://prod.trackmania.core.nadeo.online/storageObjects/9fa8e37f-54fc-4199-afe4-97587b364913",     //18
                "https://prod.trackmania.core.nadeo.online/storageObjects/e54ec82c-05fa-4ab1-b596-0b4f40df6c41",     //19
                "https://prod.trackmania.core.nadeo.online/storageObjects/70a04b67-02f1-40ca-aa82-3cd42cce2e68",     //20
                "https://prod.trackmania.core.nadeo.online/storageObjects/0cf3c082-a780-4d3f-8306-e40358cc9e61",     //21
                "https://prod.trackmania.core.nadeo.online/storageObjects/82782881-f8ea-4664-9218-849643ef590a",     //22
                "https://prod.trackmania.core.nadeo.online/storageObjects/6fecb0a7-361f-4de8-9ca5-74cfd489ab72",     //23
                "https://prod.trackmania.core.nadeo.online/storageObjects/7b14beca-dd12-4577-80df-fefdc550a2e8",     //24
                "https://prod.trackmania.core.nadeo.online/storageObjects/eefbe8b3-126f-4c80-a938-fe4bff2671df"]     //25
    

                
    //set maxNewPage and oldest new entry for pull all new matches
    async init():Promise<void> {
        this.config = Config.getConfig() as ConfigObject;
        this.headers = new fetch.Headers({
            "Accept"       : "application/json",
            "Content-Type" : "application/json",
            "User-Agent"   :  this.config.playerID
        });
        this.options = {
            headers: this.headers,
            method: "GET",
            body: null
        }

        //find maxPage
        //it can happen that a page is empty even though the next page still has entries
        //if three consecutive pages emtpty stop 
        let found = false
        let consecutive_empty = 0
        while(!found){
            await delay(8000) //delay to not get blocked by the api
            let page = await this.getPage(this.maxPage)
            console.log("currentPage: "+ page.page)
            if(page.matches.length == 0){
                consecutive_empty++
            } else {
                consecutive_empty = 0
            }
            if (consecutive_empty == 3){
                found = true
                this.maxPage = page.page - 4
            }
            this.maxPage++
        }
        console.log("Max Page: " + this.maxPage)
        await delay(10000)
    }

                
    async getPage(page: number): Promise<pageRes> {
        
        const url_get_Match_page = "https://trackmania.io/api/player/" + this.config.playerID + "/matches/2/" + page
 
        console.log("FETCH: get page " + page)
        console.log(url_get_Match_page)
        const response = new Promise<pageRes> ((resolve, reject) => {
            fetch(url_get_Match_page, this.options).then(async (res)=> {
                if(res.status != 200) {
                    reject(new Error('Page request failed ! Statuscode: ' + res.status))
                } else {
                    let mapsData = (await res.json()) as pageRes
                    resolve(mapsData)
                }
            })
        })
        return response;
    }


    async getFull():Promise<entryJson[]>{
        let result = [] as  entryJson[]
        for (let i = this.maxPage; i >= 0; i--){
            if (i != this.maxPage) {
                await delay(90000) //delay between page request to not get blocked by the api
            }
            try {
                let page = await this.getPage(i)
                let entries = await this.pageToJson(page)
                result = result.concat(entries)
            }
            catch(e){
                console.log(e.message);
            }
        }
        return result
    }


    async getMatchInfo(matchId: string): Promise<specMatchData>{

        const url_get_Match_info = "https://trackmania.io/api/match/" + matchId
        console.log("FETCH: get match " + matchId)
        return new Promise<specMatchData>((resolve, reject) => {
            fetch(url_get_Match_info, this.options).then(res => {
                if(res.status == 500) {
                    let matchData = undefined
                    resolve(matchData)
                }

                if(res.status != 200){
                    reject(new Error('Match request failed ! Statuscode: ' + res.status))
                } else {
                    let matchData = res.json() as specMatchData
                    resolve(matchData)
                }
            })
        })
        
    }


    getMapNumber(url: string): number {
        let mapNumber = 26
        for(let k = 0; k < this.urlToMap.length; k++) {
            if(this.urlToMap[k] === url) {
                mapNumber = k + 1
            }
        }
        return mapNumber
    }


    getPositioninPlayers(match: specMatchData): number{
        let players = match.players
        for (let i = 0; i < players.length; i++){
            if (players[i].player.name == this.config.playerName) {
                return i
            }
        } 
    }


    getTeamPos(match: specMatchData): number{
        let players = match.players
        let playerpos = this.getPositioninPlayers(match)
        let teamPositions: number[]
        teamPositions = []
        let team = players[playerpos].team
        let matchPos = players[playerpos].rank
        let j = 0
        for (let i = 0; i < players.length; i++){
            if (players[i].team == team) {
                teamPositions[j] = (players[i].rank)
                j++
            }
        }
        teamPositions.sort()
        for (let i = 0; i < teamPositions.length; i++){
            if (teamPositions[i] == matchPos) {
                return i + 1
            }
        }
    }


    async pageToJson(page: pageRes): Promise<entryJson[]>{
        let result: entryJson[]
        result = []
        const matches = page.matches
        for(let i = matches.length - 1; i >= 0; i--) {

            //TODO check if match is older than 7days 
            //if so return undefined
            let seven_days = 1000*60*60*24*7
            if((new Date().valueOf() - new Date(matches[i].starttime).valueOf()) > seven_days){
                console.log("no Fetch for match: " + matches[i].lid)
                let entry = {
                    date: matches[i].starttime,
                    map: undefined,
                    newTrophies: undefined,
                    win: matches[i].win,
                    mvp: matches[i].mvp,
                    teamPos: undefined,
                    totalTrophies: matches[i].afterscore
                }
                result.push(entry)

            } else {
                await delay(4000) //delay to not get blocked by the api
                let match: specMatchData
                match = await this.getMatchInfo(matches[i].lid)
                let entry = {
                    date : matches[i].starttime,
                    map : this.getMapNumber(match.maps[0].file),
                    newTrophies :  match.players[this.getPositioninPlayers(match)].matchmakingpoints.after - match.players[this.getPositioninPlayers(match)].matchmakingpoints.before,
                    win : matches[i].win,
                    mvp : matches[i].mvp,
                    teamPos : this.getTeamPos(match),
                    totalTrophies : matches[i].afterscore
                }
                result.push(entry)
            }
        }
        return result
    }

    
    jsonToExcelArray(entries: entryJson[]): RowValues[]{
        let result = []
        entries.forEach(ent => {
            let row = [[ent.date, ent.map, ent.newTrophies, ent.win, ent.mvp, ent.teamPos, ent.totalTrophies]]
            result = result.concat(row)
        })
        return result
    } 
    

    async resultToExcel(entries: entryJson[], filename: string){
        if(exists(filename)){
            
            const workbook = new ExcelJS.Workbook()
            
            await workbook.xlsx.readFile(filename);
            let worksheet = workbook.getWorksheet('My Sheet')
            
            let rows = this.jsonToExcelArray(entries)
            worksheet.addRows(rows)
            await workbook.xlsx.writeFile(filename)
            
        } else { 
            //TODO generate excel file when it does not exist
        }
    }
    
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function exists (path) {  
    try {
      await fs.accessSync(path)
      return true
    } catch (e){
      console.error(e.message)
      return false
    }
}