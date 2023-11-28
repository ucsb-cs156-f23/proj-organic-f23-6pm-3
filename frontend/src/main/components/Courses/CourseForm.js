import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function CourseForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    return (

        <Form onSubmit={handleSubmit(submitAction)}>


            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid="CourseForm-id"
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-name"
                            id="name"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("name", {
                                required: "Name is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="school">School</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-school"
                            id="school"
                            type="text"
                            isInvalid={Boolean(errors.school)}
                            {...register("school", {
                                required: "School is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.school?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="term">Term</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-term"
                            id="term"
                            type="text"
                            isInvalid={Boolean(errors.term)}
                            {...register("term", {
                                required: "Term is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.term?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="start">Start Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-start"
                            id="start"
                            type="datetime-local"
                            isInvalid={Boolean(errors.start)}
                            {...register("start", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.start && 'StartDate is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>  
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="end">End Date (iso format)</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-end"
                            id="end"
                            type="datetime-local"
                            isInvalid={Boolean(errors.end)}
                            {...register("end", { required: true })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.end && 'EndDate is required. '}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>  
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="githubOrg">Github Organization</Form.Label>
                        <Form.Control
                            data-testid="CourseForm-githubOrg"
                            id="githubOrg"
                            type="text"
                            isInvalid={Boolean(errors.githubOrg)}
                            {...register("githubOrg", {
                                required: "GithubOrganization is required."
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.githubOrg?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Button
                        type="submit"
                        data-testid="CourseForm-submit"
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid="CourseForm-cancel"
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default CourseForm;