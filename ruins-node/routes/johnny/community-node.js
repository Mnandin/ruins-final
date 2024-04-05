import express, { query } from "express";
import cors from "cors";
import db from "../../utils/mysql2-connect.js";

const router = express.Router();

router.use(cors());

//下面是選board後對應posts的邏輯
router.get("/boards/:board_id?", async (req, res) => {
  // 如果提供了板塊ID，則返回指定板塊的信息
  const board_id = +req.params.board_id;

  // 如果沒有提供板塊ID，則返回所有板塊的信息
  if (!board_id) {
    const sql = "SELECT * FROM `sn_public_boards`";
    const [boardsRows] = await db.query(sql);
    res.json(boardsRows);
    return;
  }

  let page = +req.query.page || 1;
  let totalPages = 0;
  let perPage = 2;
  // let where = " WHERE 1 ";

  // console.log(board_id);
  const t_sql =
    " SELECT COUNT(1) totalRows FROM sn_public_boards AS b JOIN sn_posts AS p USING(board_id) WHERE b.board_id =? ";
  const [[{ totalRows }]] = await db.query(t_sql, [board_id]);
  // console.log(totalRows);

  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      const newQuery = { ...req.query, page: totalPages };
      const qs = new URLSearchParams(newQuery).toString();
      console.log("qs:", qs);
      return { success: false, redirect: `?${qs}` };
    }
  }

  const selectedBdPosts = `SELECT * FROM sn_public_boards AS b JOIN sn_posts AS p USING(board_id) WHERE b.board_id = ? ORDER BY p.post_id DESC LIMIT ${
    (page - 1) * perPage
  }, ${perPage} `;
  // const selectedBdPosts = `SELECT * FROM sn_public_boards AS b JOIN sn_posts AS p USING(board_id) WHERE b.board_id = ? ORDER BY p.post_id DESC`;

  const [selectedBdPostsRows] = await db.query(selectedBdPosts, [board_id]);
  if (selectedBdPostsRows.length === 0) {
    return { success: false, error: "Posts not found(Backend Msg)" };
  }

  res.json({
    success: true,
    selectedBdPostsRows,
    page,
    perPage,
    totalPages,
  });

  // const sql =
  //   "SELECT * FROM sn_public_boards AS b JOIN sn_posts AS p USING(board_id) WHERE b.board_id = ?";
  // const [postsRows] = await db.query(sql, [board_id]);

  // if (postsRows.length === 0) {
  //   res.json([{ error: "Posts not found(Backend Msg)" }]); //符合前端的fetch內容map才部會出錯
  //   return;
  // }

  // res.json(postsRows);
});

router.get("/posts/:post_id?", async (req, res) => {
  const post_id = +req.params.post_id;

  if (!post_id) {
    let page = +req.query.page || 1;
    // console.log(page);
    // let keyword = req.query.keyword || "";
    let where = " WHERE 1 ";

    // if (keyword) {
    //   const keywordEsc = db.escape("%" + keyword + "%");
    //   where += AND
    // }

    if (page < 1) {
      return { success: false, redirect: "?page=1" };
    }

    const perPage = 10;
    const t_sql = `SELECT COUNT(1) totalRows FROM sn_posts ${where}`;
    // console.log(t_sql);
    const [[{ totalRows }]] = await db.query(t_sql);
    // console.log(totalRows);

    let totalPostsRows = [];
    let totalPages = 0;

    if (totalRows) {
      totalPages = Math.ceil(totalRows / perPage);
      if (page > totalPages) {
        const newQuery = { ...req.query, page: totalPages };
        const qs = new URLSearchParams(newQuery).toString();
        return { success: false, redirect: `?` + qs };
      }
    }

    const totalPostsSql = ` SELECT * FROM sn_posts ${where} ORDER BY post_id DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage}`;
    [totalPostsRows] = await db.query(totalPostsSql);

    console.log(req.query);

    res.json({
      success: true,
      totalPages,
      totalRows,
      page,
      perPage,
      totalPostsRows,
      query: req.query,
    });

    return;
  }
  const chosenPostSql = " SELECT * FROM sn_posts WHERE post_id=? ";
  const [chosenPost] = await db.query(chosenPostSql, [post_id]);
  res.json(chosenPost);
});

router.get("/add", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    errors: {},
  };
});

export default router;
