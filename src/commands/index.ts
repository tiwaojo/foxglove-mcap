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
    addRecord,  // Add a record to an MCAP file
    cat,        // Print an MCAP file to stdout
    compress,   // Compress an MCAP file
    convert,    // Convert an MCAP file
    decompress, // Decompress an MCAP file
    doctor,     // Check an MCAP file for errors
    filter,     // Filter records in an MCAP file
    get,        // Get a record from an MCAP file
    help,       // Show help for a command
    info,       // Show information about an MCAP file
    list,       // List records in an MCAP file
    merge,      // Merge MCAP files
    recover,    // Recover an MCAP file from a corrupted file,
];