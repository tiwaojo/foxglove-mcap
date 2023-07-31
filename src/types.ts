export interface MCAPCommand {
    command: string,
    description: string,
    flagsAndArgs?: Map<string,string>
};