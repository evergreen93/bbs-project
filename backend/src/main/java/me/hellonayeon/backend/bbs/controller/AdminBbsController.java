package me.hellonayeon.backend.bbs.controller;

import java.util.List;

import me.hellonayeon.backend.bbs.domain.Bbs;
import me.hellonayeon.backend.bbs.service.BbsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/boards")
public class AdminBbsController {

    private final BbsService bbsService;

    public AdminBbsController(BbsService bbsService) {
        this.bbsService = bbsService;
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getBoardCount() {
        return ResponseEntity.ok(
                bbsService.getBoardCount()
        );
    }

    @GetMapping
    public ResponseEntity<List<Bbs>> getBoardList() {
        return ResponseEntity.ok(
                bbsService.getAdminBoardList()
        );
    }

    @DeleteMapping("/{seq}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable Integer seq
    ) {
        bbsService.deleteBbsByAdmin(seq);

        return ResponseEntity.ok().build();
    }
}