import { RowValues } from "exceljs";

export interface TrackmaniaIO {
    
    //get page with the given number 
    getPage(page: number): Promise<pageRes>;

    /*
    *initializes TM Wrapper
    * - gets config
    * - sets variables needed for api fetch
    * - set maxPage
    */
    init():Promise<void>

    //gets all matches from all pages depending on maxPages
    getFull():Promise<entryJson[]>

    //gets the info for one match if it is still availabe (not older than 2 weeks)
    getMatchInfo(matchId: string): Promise<specMatchData>

    //get the map number according to the download link
    getMapNumber(url: string): number

    //get the position of the player in a match
    getPositioninPlayers(match: specMatchData): number

    //get the position of the player in his team 
    getTeamPos(match: specMatchData): number

    //returns array with all important info of each match
    pageToJson(page: pageRes): Promise<entryJson[]>

    //returns data fitting to write to excel
    jsonToExcelArray(entries: entryJson[]): RowValues[]

    //writes the data to the excel file
    resultToExcel(entries: entryJson[], filename: string)

}

export interface entryJson{
    date : string,
    map: number,
    newTrophies: number,
    win: boolean,
    mvp: boolean,
    teamPos: number,
    totalTrophies: number,

}

interface scriptsettingsData{
    name: string,
    type: string,
    value: number,
}

interface divisionData{
    position: number,
    rule: string,
    minpoints: number,
    maxpoints: number
}

interface mmData{
    typename: string,
    typeid: number,
    accountid: string,
    rank: number,
    score: number,
    progression: number,
    division: divisionData,
    division_next: divisionData
}

interface playerData {
    name: string,
    id: string,
    zone: {
        name: string,
        flag: string,
        parent:{
            name: string,
            flag: string,
            parent: {
                name: string,
                flag: string,
                parent: {
                    name: string,
                    flag: string
                }
            }
        }
    }
}

export interface playersData{
    player: playerData,
    rank: number,
    score: number,
    team: number,
    mvp: boolean,
    matchmaking: mmData,
    matchmakingpoints: {
        valid: boolean,
        before: number,
        after: number
    }
}

export interface specMatchData {
    id: number,
    lid: string,
    name: string,
    group: string,
    startdate: string,
    enddate: number,
    scoredirection: string,
    participanttype: string,
    scriptsettings: scriptsettingsData[],
    maps: [
        {
            file: string
        }
    ],
    serverid: number,
    serverjoinlink: string,
    status: string,
    players: playersData[]
}

interface specMatchDataEx{
    matchData: specMatchData,
    valid: boolean,
}

interface matchData {
    afterscore: number,
    win: boolean,
    leave: boolean,
    mvp: boolean,
    typename: string,
    typeid: number,
    lid: string,
    starttime: string
}

export interface pageRes {
    page: number;
    matches: matchData[]
}