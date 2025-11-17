package com.longdistancebus.review.web.dto;

import jakarta.validation.constraints.NotBlank;

public class ReviewStatusUpdateRequest {
    @NotBlank
    private String status;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

