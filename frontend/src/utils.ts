/*
 * Converts a string into a "slug", which does the following:
 *   - Converts all letters to lower-case
 *   - Removes any non-digit/letter/dash/white space
 *   - Replaces white space with dashes
 *   - Replaces strings of dashes with a single dash
 *
 * @param name - A string, representing the name of a project
 * @returns A sluggified version of the string
 *
 */

export const nameSlug = (name: string): string => {
    return name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/*
 * Converts an integer representing a file size in bytes to a string with the closest SI prefix
 * (SI prefix being "kilo", "mega", "giga" and so on, hence "kilobyte", "megabyte"...)
 *
 * @param fileSize: an integer representing the size of a file in bytes
 * @returns A string representing the file with its best fitting SI prefix to two decimal places
 *
 */

export const sizeConversion = (fileSize: number):string => {
    let sizeUnits = ["B", "KB", "MB", "GB", "TB"]
    let i = 0;
    while (fileSize > 1000){
        i++;
        fileSize /= 1000;
    }
    if (i > 4){
        return "very big!"
    }
    return fileSize.toFixed(2) + sizeUnits[i];

}
