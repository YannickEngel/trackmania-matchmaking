import { RowValues } from "exceljs";

export interface TrackmaniaIO {
    
    getPage(page: number): Promise<pageRes>;

    init():Promise<void>

    getFull():Promise<entryJson[]>

    getMatchInfo(matchId: string): Promise<specMatchData>

    getMapNumber(url: string): number

    getPositioninPlayers(match: specMatchData): number

    getTeamPos(match: specMatchData): number

    pageToJson(page: pageRes): Promise<entryJson[]>

    jsonToExcelArray(entries: entryJson[]): RowValues[]

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