package com.longdistancebus.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="trip")
public class Trip {
    @Id
    private String id;

    private String routeid;
    private String busid;
    private String giokhoihanh;
    private String gioden;
    private int giave;
    private int tinhtrang;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRouteid() {
        return routeid;
    }

    public void setRouteid(String routeid) {
        this.routeid = routeid;
    }

    public String getBusid() {
        return busid;
    }

    public void setBusid(String busid) {
        this.busid = busid;
    }

    public String getGiokhoihang() {
        return giokhoihanh;
    }

    public void setGiokhoihang(String giokhoihang) {
        this.giokhoihanh = giokhoihang;
    }

    public String getGioden() {
        return gioden;
    }

    public void setGioden(String gioden) {
        this.gioden = gioden;
    }

    public int getGiave() {
        return giave;
    }

    public void setGiave(int giave) {
        this.giave = giave;
    }

    public int getTinhtrang() {
        return tinhtrang;
    }

    public void setTinhtrang(int tinhtrang) {
        this.tinhtrang = tinhtrang;
    }
}
