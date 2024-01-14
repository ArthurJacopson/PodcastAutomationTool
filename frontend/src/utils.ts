export const nameSlug = (name: string): string => {
    return name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}


export const sizeConversion = (fileSize: number):string => {
    let sizeUnits = ["B", "KB", "MB", "GB", "TB"]
    let i = 0;
    while (fileSize > 1000){
        i++;
        fileSize /= 1000;
    }
    if (i > 4){
        return "very big"!
    }
    return fileSize.toFixed(2) + sizeUnits[i];

}
