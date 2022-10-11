import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";

export function DashboardHowToUse() {
    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);
    document.title = "How To Use"
    return (
        <section>
            <div className="container">
                <h1 className="display-3">How To Use</h1>
                <div className="card my-3">
                    <div className="card-body border-bottom">
                        <h4 className="bold">1 Jual pekerjaan kamu di Fastwork</h4>
                        <p>Grafis dan Desain
                            Penulisan dan Penerjemahan
                            Web dan Pemrograman
                            Visual dan Audio
                            Pemasaran dan Periklanan</p>

                    </div>
                    <div className="card-body border-bottom">
                        <h4 className="bold">2 Berdiskusi lebih detil dan kirimkan Pemberi Kerja kuotasi dan kontrak </h4>
                        <p>Fastwork akan mencarikan Pemberi Kerja untuk Anda.
                            Anda dapat mengklik tombol “Buat sebuah penawaran” untuk
                            Sistem tidak mengijinkan Anda untuk bertukar kontak seperti, LINE ID, nomor telephone atau email dengan freelancer.</p>
                    </div>
                    <div className="card-body">
                        <h4 className="bold">3 Tunggu sampai Pemberi Kerja mengirimkan uang ke sistem kami, dan Anda bisa memulai bekerja. </h4>
                        <p>Jangan mulai bekerja jika Anda belum menerima pemberitahuan dari sistem.
                            Setelah pembayaran sukses, Anda bisa memulai bekerja dan dapat bertukar kontak seperti: LINE ID, nomor telephone atau email.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}