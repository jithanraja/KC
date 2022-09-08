export * from './api';

export function getLocalDate(dateString) {
    let date = ''
    try {
        date = new Date(dateString);
        date = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    } catch(e) {
        console.log(e)
    }
    return date;
}