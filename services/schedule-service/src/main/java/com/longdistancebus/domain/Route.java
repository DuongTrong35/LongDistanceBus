package com.longdistancebus.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="route")
public class Route {
    @Id
    private String id;

    private String diemdi;
    private String diemden;
    private double quangduong;
    private double thoigian;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDiemdi() {
        return diemdi;
    }

    public void setDiemdi(String diemdi) {
        this.diemdi = diemdi;
    }

    public String getDiemden() {
        return diemden;
    }

    public void setDiemden(String diemden) {
        this.diemden = diemden;
    }

    public double getQuangduong() {
        return quangduong;
    }

    public void setQuangduong(double quangduong) {
        this.quangduong = quangduong;
    }

    public double getThoigian() {
        return thoigian;
    }

    public void setThoigian(double thoigian) {
        this.thoigian = thoigian;
    }
}
