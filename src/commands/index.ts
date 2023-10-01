import addRecord from "./add";
import cat from "./cat";
import compress from "./compress";
import convert from "./convert";
import decompress from "./decompress";
import doctor from "./doctor";
import filter from "./filter";
import get from "./get";
import help from "./help";
import info from "./info";
import list from "./list";
import merge from "./merge";
import recover from "./recover";

export default [
    addRecord,//{ command: "add", description: "Add a record to an MCAP file" },
    cat, //{ command: "cat", description: "Print an MCAP file to stdout" },
    compress, //{ command: "compress", description: "Compress an MCAP file" },
    // convert, //{ command: "convert", description: "Convert an MCAP file" },
    decompress, //{ command: "decompress", description: "Decompress an MCAP file" },
    doctor, //{ command: "doctor", description: "Check an MCAP file for errors" },
    get, //{ command: "get", description: "Get a record from an MCAP file" },
    help, //{ command: "help", description: "Show help for a command" },
    info, //{ command: "info", description: "Show information about an MCAP file" },
    list, //{ command: "list", description: "List records in an MCAP file" },
    merge, 
    recover, //{ command: "recover", description: "Recover an MCAP file" },
    filter,
];