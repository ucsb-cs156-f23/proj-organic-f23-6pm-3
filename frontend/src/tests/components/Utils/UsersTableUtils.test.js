import { cellToAxiosParamsToggleAdmin, cellToAxiosParamsToggleInstructor, toggleAdminSuccess, toggleInstructorSuccess } from "main/components/Utils/UsersTableUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("UsersTableUtils", () => {

    describe("toggleAdminSuccess", () => {

        test("Admin: It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            toggleAdminSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });
    
        test("Instructor: It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            toggleInstructorSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });

    describe("cellToAxiosParamsDelete", () => {

        test("Admin returns the correct params", () => {
            // arrange
            const cell = {row: {values:{id:"admin"}}}
            const result = cellToAxiosParamsToggleAdmin(cell);
            expect(result).toEqual({
                url: "/api/admin/users/toggleAdmin",
                method: "POST",
                params: {id:"admin"}
            }); 
        });

        test("Instructor returns the correct params", () => {
            // arrange
            const cell = {row: {values:{id:"instructor"}}}
            const result = cellToAxiosParamsToggleInstructor(cell);
            expect(result).toEqual({
                url: "/api/admin/users/toggleInstructor",
                method: "POST",
                params: { id:"instructor" }
            }); 
        });
    });
});




