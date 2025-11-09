
package com.example.LongDistanceBus.domain;

import jakarta.persistence.*;   // (giữ phần JPA bạn đang có)
        import lombok.Getter;
import lombok.Setter;
// hoặc dùng @Data nếu bạn muốn có cả equals/hashCode/toString

@Entity @Table(name="seats")
@Getter
@Setter
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Bus bus;

    private String code;
    private String type;
}
