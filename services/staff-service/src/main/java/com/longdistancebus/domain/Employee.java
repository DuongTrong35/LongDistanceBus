package com.longdistancebus.domain;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name="employee")
public class Employee {
    @Id
    private String id;

    private int userid;
    private String honv;
    private String tennv;
    private String gioitinh;
    private LocalDate ngaysinh;
    private String cmnd;
    private String sdt;
    private String email;
    private LocalDate  ngayvaolam;
    private String chucvu;
    private int tinhtrang;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getHonv() {
        return honv;
    }

    public void setHonv(String honv) {
        this.honv = honv;
    }

    public String getTennv() {
        return tennv;
    }

    public void setTennv(String tennv) {
        this.tennv = tennv;
    }

    public String getGioitinh() {
        return gioitinh;
    }

    public void setGioitinh(String gioitinh) {
        this.gioitinh = gioitinh;
    }

    public LocalDate getNgaysinh() {
        return ngaysinh;
    }

    public void setNgaysinh(LocalDate  ngaysinh) {
        this.ngaysinh = ngaysinh;
    }

    public String getCmnd() {
        return cmnd;
    }

    public void setCmnd(String cmnd) {
        this.cmnd = cmnd;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate  getNgayvaolam() {
        return ngayvaolam;
    }

    public void setNgayvaolam(LocalDate  ngayvaolam) {
        this.ngayvaolam = ngayvaolam;
    }

    public String getChucvu() {
        return chucvu;
    }

    public void setChucvu(String chucvu) {
        this.chucvu = chucvu;
    }

    public int getTinhtrang() {
        return tinhtrang;
    }

    public void setTinhtrang(int tinhtrang) {
        this.tinhtrang = tinhtrang;
    }
}
