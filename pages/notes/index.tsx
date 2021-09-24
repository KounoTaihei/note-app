import prisma from "../../lib/prisma";
import { GetStaticProps } from "next";
import { CircularProgress, FormControl, FormControlLabel, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemText, NativeSelect, Radio, RadioGroup, TextField } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faPen, faPlus, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { NoteCreateModal } from '../../components/notes/note_create.modal';
import { BreadCrumbs } from "../../components/breadcrumbs";
import { revalidateTime } from "../../lib/revalidate_time";
import { NoteWithUserAndItems } from "../../types/note";
import { getSortedNotes } from "../../functions/get_sorted_notes";
import styles from '../../styles/Note.module.scss';
import { Formik } from "formik";
import { NoteItem } from "../../components/notes/note_item";

const Notes = (props: Props) => {
    const [ notes, setNotes ] = useState<NoteWithUserAndItems[]>(getSortedNotes(props.notes, "0", "0"));
    const [ modalOpen, setModalOpen ] = useState<boolean>(false);
    const [ submitting, setSubmitting ] = useState<boolean>(false);
    
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);

    const useStyles = makeStyles(() =>
        createStyles({
            openIconActive: {
                transform: "rotate(180deg)",
                transitionDuration: "0.3s"
            },
            openIcon: {
                transform: "ratate(0)",
                transitionDuration: "0.3s"
            },
            icon: {
                fontSize: "1.4em",
                padding: "1rem"
            },
            formControl: {
                margin: "0.3rem",
            },
            searchInput: {
                width: "80%",
                margin: "0 auto"
            },
            radioButton: {
                color: "pink"
            }
        })
    );
    const classes = useStyles();

    const initialValues: FormValues = {
        searchText: "",
        orderBy: "0",
        ascOrDesc: "0"
    }

    const submit = async (values: FormValues) => {
        setSubmitting(true);
        console.log(values);

        let data: NoteWithUserAndItems[];
        if(values.searchText) {
            data = await fetch(`/api/notes/${values.searchText}`)
            .then(res => res.json());
        } else {
            data = await fetch('/api/notes')
            .then(res => res.json());
        }

        const newNotes = getSortedNotes(data, values.orderBy, values.ascOrDesc);
        setNotes(newNotes);

        setSubmitting(false);
    }

    return (
        <>
            <BreadCrumbs
                current="ノート一覧"
            />
            {/* 検索メニュー等 */}
            <div className={menuOpen ? `${styles.menu_wrapper} ${styles.active}` : styles.menu_wrapper}>
                <div className="flex justify-between">
                    <IconButton
                        className={classes.icon}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FontAwesomeIcon icon={faChevronDown} className={menuOpen ? classes.openIconActive : classes.openIcon} />
                    </IconButton>
                    <IconButton
                        onClick={() => setModalOpen(true)}
                        className={classes.icon}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                </div>
                {/* 検索、ソートメニュー */}
                <div className="bg-white relative">
                    <div className={menuOpen ? `${styles.overlay} ${styles.active}` : styles.overlay} onClick={() => setMenuOpen(false)}></div>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={submit}
                    >
                        {({
                            values,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting
                        }) => (
                            <form onSubmit={handleSubmit} className={menuOpen ? `${styles.menu} ${styles.active}` : styles.menu}>
                                <div className="w-full">
                                    <FormControl className={classes.formControl}>
                                        <InputLabel variant="standard" htmlFor="orderbyInput">
                                            並び替え
                                        </InputLabel>
                                        <NativeSelect
                                            id="orderByInput"
                                            name="orderBy"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.orderBy}
                                        >
                                            <option value={0}>ノート内のアイテムの作成日</option>
                                            <option value={1}>ノートの作成日</option>
                                            <option value={2}>ノート内のアイテムの数</option>
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <RadioGroup
                                            row
                                            name="ascOrDesc"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.ascOrDesc}
                                        >
                                            <FormControlLabel
                                                value={0}
                                                label="降順"
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        checked={values.ascOrDesc === "0" ? true : false}
                                                    />
                                                }
                                            />
                                            <FormControlLabel
                                                value={1}
                                                label="昇順"
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        checked={values.ascOrDesc === "1" ? true : false}
                                                    />
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl fullWidth variant="standard" className={classes.formControl}>
                                        <TextField
                                            label="ノートを検索"
                                            name="searchText"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.searchText}
                                            className={classes.searchInput}
                                        />
                                    </FormControl>
                                </div>
                                <div className={submitting ? `${styles.submitbtn} ${styles.active}` : styles.submitbtn}>
                                    <IconButton className={classes.icon} type="submit" disabled={isSubmitting}>
                                        <FontAwesomeIcon icon={faSyncAlt} />
                                    </IconButton>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            {submitting && (
                <div className="text-center py-8">
                    <CircularProgress color="primary"/>
                </div>
            )}
            {!submitting && (
                <List>
                    {notes.map(note =>
                        <NoteItem note={note} />
                    )}
                </List>
            )}
            <NoteCreateModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const res = await prisma.note.findMany({
        include: {
            user: true,
            items: true
        }
    });
    const notes: NoteWithUserAndItems[] = await JSON.parse(JSON.stringify(res));

    return {
        props: {
            notes
        },
        revalidate: revalidateTime
    }
}

interface Props {
    notes: NoteWithUserAndItems[]
}

interface FormValues {
    searchText: string
    orderBy: string
    ascOrDesc: string
}

export default Notes;