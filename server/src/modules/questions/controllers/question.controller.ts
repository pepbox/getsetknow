import { Request, Response } from 'express';
import QuestionService from '../services/question.service';
import { IQuestion } from '../types/interfaces';
import { Question } from '../models/question.model';

const questionService = new QuestionService(Question);

export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const questions: IQuestion[] = await questionService.getAllQuestions();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
};

export const createQuestion = async (req: Request, res: Response) => {
    try {
        const question: IQuestion = await questionService.createQuestion(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error creating question', error });
    }
};

export const getQuestionById = async (req: Request, res: Response) => {
    try {
        const question: IQuestion | null = await questionService.getQuestionById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching question', error });
    }
};

export const storeQuestionResponse = async (req: Request, res: Response) => {
    try {
        const { question, response } = req.body;
        // console.log("user : :" , req.user)
        const player = req.user?.id || "687df81aee46eaa7a14418f6";
        const questionResponse = await questionService.storeQuestionResponse({ question, player, response });
        res.status(201).json(questionResponse);
    } catch (error) {
        res.status(500).json({ message: 'Error storing question response', error });
    }
};