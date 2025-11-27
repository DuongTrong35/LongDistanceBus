package com.longdistancebus.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="allroute")
public class AllRoute {
    @Id
    private int Stt;

    private String Ten;
    private String Gio;
    private String Mota;
    private String link;
    private int Tinhtrang;

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public int getStt() {
        return Stt;
    }

    public void setStt(int stt) {
        Stt = stt;
    }

    public String getTen() {
        return Ten;
    }

    public void setTen(String ten) {
        Ten = ten;
    }

    public String getGio() {
        return Gio;
    }

    public void setGio(String gio) {
        Gio = gio;
    }

    public String getMota() {
        return Mota;
    }

    public void setMota(String mota) {
        Mota = mota;
    }

    public int getTinhtrang() {
        return Tinhtrang;
    }

    public void setTinhtrang(int tinhtrang) {
        Tinhtrang = tinhtrang;
    }
}
