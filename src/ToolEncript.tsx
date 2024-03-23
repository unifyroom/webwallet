import CryptoJS from 'crypto-js'

export function encript(text: string, key: string): string {
    try {
        var iv = CryptoJS.enc.Hex.parse('F2EBAE2CDF804895B5C091D0310169C9')
        var cfg = { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.Pkcs7 }
        var ciphertext = CryptoJS.AES.encrypt(text, key, cfg)
        return ciphertext.toString()
    } catch (err) {
        console.log(err)
        return ''
    }
}


// decrypt = (encryptedData, key) => {
//     try {
//         var iv = CryptoJS.enc.Hex.parse('F2EBAE2CDF804895B5C091D0310169C9')
//         var cfg = { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.Pkcs7 }
//         var decrypted = CryptoJS.AES.decrypt(encryptedData, key, cfg)
//         return decrypted.toString(CryptoJS.enc.Utf8)
//     } catch (err) {
//         console.log(err)
//         return ''
//     }
// }

// isCorrectPasswordHash = password => {
//     return (
//         this.deriveHash(password) ===
//         this.decrypt(this.state.encryptedPasswordHash, '9ADE0896B2594184BA36E757C8E6EFD7')
//     )
// }

export function deriveHash(pwd: string){
    return CryptoJS.SHA256(pwd).toString()
}

export function encriptPassword(pwd: string): string{
    const passwordHash = deriveHash(pwd)
	return encript(passwordHash, '9ADE0896B2594184BA36E757C8E6EFD7')
}

