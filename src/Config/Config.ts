import fs from 'fs'


export class Config{
    private static config: ConfigObject


    public static getConfig(): ConfigObject{
        if(this.config !== undefined) {
            return this.config
        } else {
            let file = fs.readFileSync("config.json").toString()
            let conf = JSON.parse(file) as ConfigObject
            this.config = {
                playerID: conf.playerID,
                playerName: conf.playerName
            }
            return this.config
        }
    }

}

export interface ConfigObject{
    playerID: string,
    playerName: string
}