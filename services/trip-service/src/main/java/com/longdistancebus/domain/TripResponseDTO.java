package com.longdistancebus.domain;
import com.longdistancebus.domain.AllRoute;
import com.longdistancebus.domain.Trip;
public class TripResponseDTO {
    public String id;
    public String busid;
    public String routeid;
    public String giokhoihang;
    public String gioden;
    public int giave;

    private String idtrip;
    private String diemdi;
    private String diemden;
    private double quangduong;
    private double thoigian;

    public TripResponseDTO(Trip trip, Route route) {
        this.id = trip.getId();
        this.busid = trip.getBusid();
        this.routeid = trip.getRouteid();
        this.giokhoihang = trip.getGiokhoihang();
        this.gioden = trip.getGioden();
        this.giave = trip.getGiave();

        this.idtrip = route.getId();
        this.diemdi = route.getDiemdi();
        this.diemden = route.getDiemden();
        this.quangduong = route.getQuangduong();
        this.thoigian=route.getThoigian();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBusid() {
        return busid;
    }

    public void setBusid(String busid) {
        this.busid = busid;
    }

    public String getRouteid() {
        return routeid;
    }

    public void setRouteid(String routeid) {
        this.routeid = routeid;
    }

    public String getGiokhoihang() {
        return giokhoihang;
    }

    public void setGiokhoihang(String giokhoihang) {
        this.giokhoihang = giokhoihang;
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

    public String getIdtrip() {
        return idtrip;
    }

    public void setIdtrip(String idtrip) {
        this.idtrip = idtrip;
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
