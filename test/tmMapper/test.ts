import {TM_IO_Wrapper} from '../../src/TrackmainaIOWrapper'
import {assert} from 'chai'
import {describe, before, after, it} from 'mocha'
import internal from 'stream'
import { entryJson, specMatchData, playersData } from '../../src/TrackmaniaIOInterface'
const fs = require('fs')

let tmWrapper: TM_IO_Wrapper
let entries: entryJson[]
let entries2: entryJson[]
let excelEntries = [["123", 1, 1, true, false, 2, 10], ["234", 2, 2, false, true, 3 ,20]]


let pos1Data, pos2Data, pos3Data, pos4Data, pos5Data, pos6Data: specMatchData
let pos1Array: playersData[]
let pos2Array: playersData[]
let pos3Array: playersData[]
let pos4Array: playersData[]
let pos5Array: playersData[]
let pos6Array: playersData[]

function createPlayerDataPosition(rank: number, team: number, name: boolean) {
    return {
        player: {
            name: (name ? "MrHankey42" : ""),
            id: "",
            zone: undefined
        },
        rank: rank,
        score: undefined,
        team: team,
        mvp: undefined,
        matchmaking: undefined,
        matchmakingpoints:undefined
    }
}

function emptyspecMatchData(): specMatchData {
    return {
        id: undefined,
        lid: undefined,
        name: undefined,
        group: undefined,
        startdate: undefined,
        enddate: undefined,
        scoredirection: undefined,
        participanttype: undefined,
        scriptsettings: undefined,
        maps: undefined,
        serverid: undefined,
        serverjoinlink: undefined,
        status: undefined,
        players: []
    }
}

describe("Test TM Wrapper functions", function () { 

    before("Initialize TM Wrapper", async () => {
        tmWrapper = new TM_IO_Wrapper();
        tmWrapper.init()
        entries = [{
            date : "123",
            map: 1,
            newTrophies: 1,
            win: true,
            mvp: false,
            teamPos: 2,
            totalTrophies: 10
        },
        {
            date : "234",
            map: 2,
            newTrophies: 2,
            win: false,
            mvp: true,
            teamPos: 3,
            totalTrophies: 20
        }]
        entries2 = [{
            date : "test2",
            map: 1,
            newTrophies: 1,
            win: true,
            mvp: false,
            teamPos: 2,
            totalTrophies: 10
        },
        {
            date : "test2",
            map: 2,
            newTrophies: 2,
            win: false,
            mvp: true,
            teamPos: 3,
            totalTrophies: 20
        }]
            
        })

    after("", () => {})

    it("Test conversion from jsonResult to ExcelInputArray", function() {

        let result = tmWrapper.jsonToExcelArray(entries)
        let expected = [["123", 1, 1, true, false, 2, 10], ["234", 2, 2, false, true, 3 ,20]]

        assert.deepEqual(result, expected)
    })

    
    
    
})

describe("Test team position method of TM Wrapper", () => {

    before("", () => {
        pos1Array = [createPlayerDataPosition(1, 1, true), createPlayerDataPosition(2, 1, false), createPlayerDataPosition(3, 1, false), createPlayerDataPosition(4, 2, false), createPlayerDataPosition(5, 2, false), createPlayerDataPosition(6, 2, false)]
        pos2Array = [createPlayerDataPosition(2, 1, true), createPlayerDataPosition(1, 1, false), createPlayerDataPosition(3, 1, false), createPlayerDataPosition(4, 2, false), createPlayerDataPosition(5, 2, false), createPlayerDataPosition(6, 2, false)]
        pos3Array = [createPlayerDataPosition(3, 1, true), createPlayerDataPosition(1, 1, false), createPlayerDataPosition(2, 1, false), createPlayerDataPosition(4, 2, false), createPlayerDataPosition(5, 2, false), createPlayerDataPosition(6, 2, false)]
        pos4Array = [createPlayerDataPosition(4, 1, true), createPlayerDataPosition(1, 1, false), createPlayerDataPosition(3, 1, false), createPlayerDataPosition(2, 2, false), createPlayerDataPosition(5, 2, false), createPlayerDataPosition(6, 2, false)]
        pos5Array = [createPlayerDataPosition(5, 1, true), createPlayerDataPosition(4, 1, false), createPlayerDataPosition(6, 1, false), createPlayerDataPosition(2, 2, false), createPlayerDataPosition(1, 2, false), createPlayerDataPosition(3, 2, false)]
        pos6Array = [createPlayerDataPosition(6, 1, true), createPlayerDataPosition(2, 1, false), createPlayerDataPosition(1, 1, false), createPlayerDataPosition(4, 2, false), createPlayerDataPosition(3, 2, false), createPlayerDataPosition(5, 2, false)]
            
        pos1Data = emptyspecMatchData()
        pos2Data = emptyspecMatchData()
        pos3Data = emptyspecMatchData()
        pos4Data = emptyspecMatchData()
        pos5Data = emptyspecMatchData()
        pos6Data = emptyspecMatchData()

        pos1Data.players = pos1Array
        pos2Data.players = pos2Array
        pos3Data.players = pos3Array
        pos4Data.players = pos4Array
        pos5Data.players = pos5Array
        pos6Data.players = pos6Array
    })

    it("Test calculation of position in team when overall position is 1", () => {
        assert.equal(tmWrapper.getTeamPos(pos1Data), 1)
    })
    
    it("Test calculation of position in team when overall position is 2", () => {
        assert.equal(tmWrapper.getTeamPos(pos2Data), 2)
    })
    
    it("Test calculation of position in team when overall position is 3", () => {
        assert.equal(tmWrapper.getTeamPos(pos3Data), 3)
    })
    
    it("Test calculation of position in team when overall position is 4", () => {
        assert.equal(tmWrapper.getTeamPos(pos4Data), 3)
    })
    
    it("Test calculation of position in team when overall position is 5", () => {
        assert.equal(tmWrapper.getTeamPos(pos5Data), 2) 
    })
    
    it("Test calculation of position in team when overall position is 6", () => {
        assert.equal(tmWrapper.getTeamPos(pos6Data), 3)
    })

})




